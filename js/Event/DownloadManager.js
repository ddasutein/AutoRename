/** MIT License
 * 
 * Copyright (c) 2023 Dasutein
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * See more: https://github.com/ddasutein/AutoRename/blob/master/LICENSE
 * 
 */

/**
 * Start downloading files
 * 
 * @param {object} downloadQueue Images that are in queue to download
 */

let dmFileName = "";
let dmWebsite = "";
let dmTwitterSaveToFolderByUserName = false;
let dmTwitterUsername = "";
let generalSettings;

function StartDownload(downloadQueue){

    generalSettings = Settings.Load().General.map((data)=>{
        return {
            "key": data.key,
            "value": data.value
        }
    }).reduce((obj, data)=>{
        obj[data.key] = data;
        return obj;
    }, {});

    if (generalSettings["global_enable_save_as_window"].value == true){
        downloadQueue.forEach((dq)=>{
            dmFileName = dq.filename;
            dmWebsite = dq.website;

            if (dq.website == "twitter"){
                dmTwitterUsername = dq.username
                dmTwitterSaveToFolderByUserName = dq.save_to_folder_by_username;
            }

            chrome.downloads.download({
                url: dq.url,
                filename: dq.filename,
                saveAs: true
            },((id)=>{
                console.log(`download id : ${id}`)
            }));
        });
    } else {
        downloadQueue.forEach((dq)=>{
            dmFileName = dq.filename;
            dmWebsite = dq.website;

            if (dq.website == "twitter"){
                dmTwitterUsername = dq.username
                dmTwitterSaveToFolderByUserName = dq.save_to_folder_by_username;
            }

            chrome.downloads.download({
                url: dq.url,
                filename: dq.filename,
                saveAs: false
            },((id)=>{
                console.log(`download id : ${id}`)
            }));
        });
    }
}

chrome.downloads.onChanged.addListener(function (downloadDelta) {
    chrome.storage.local.get({
        showDownloadFolderCheckbox: false
    }, function (items) {
        if (downloadDelta.state && downloadDelta.state.current == "complete") {

            if (DevMode){
                const DEBUG_TAG = "downloadsOnChangedListener => ";
                console.log(DEBUG_TAG + downloadDelta.state.current);
            }

            if (generalSettings["global_show_download_folder"].value == true){
                chrome.downloads.showDefaultFolder();
            }
            return;
        }
    });
});

chrome.downloads.onCreated.addListener((item)=>{
    console.log("downloads listener oncreate")
    chrome.downloads.search({}, ((items)=>{

        items.forEach((item)=>{
            // console.log(item);
            // console.log(item.state)
            let totalBytes = item.totalBytes;
            let receivedByes = item.bytesReceived;
            console.log(`Item state: ${item.state}`)
            if (item.state == "in_progress"){

                console.log(`FILE SIZE [IN PROG] [${item.id}]: ${totalBytes} of ${receivedByes}`);    
            }

            if (item.state == "complete"){
                console.log(`FILE SIZE [COMPLETE] [${item.id}]: ${totalBytes} of ${receivedByes}`);    

            }
        });
    
    }));
});

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest)=>{

    if (generalSettings["global_use_autorename_folder"].value == false){
        return;
    }
    
    let suggestedFile = dmFileName;
    if (!!dmTwitterUsername){

        if (dmTwitterSaveToFolderByUserName == true){
            suggestedFile = `AutoRename/Twitter/${dmTwitterUsername}/${dmFileName}`;
        } else {
            suggestedFile = `AutoRename/Twitter/${dmFileName}`;
        }

        dmTwitterUsername = ""; // This should be empty so it can redirect to the root download folder
    } else {

        switch (dmWebsite){
            case "lineblog":
                suggestedFile = `AutoRename/LINE BLOG/${suggestedFile}`
                break;

            default:
                suggestedFile = `AutoRename/${suggestedFile}`
                break;
        }

    }

    suggest({
        filename: suggestedFile,
        overwrite: false
    });

});

