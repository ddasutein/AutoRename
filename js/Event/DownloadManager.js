/** MIT License
 * 
 * Copyright (c) 2021 Dasutein
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
function StartDownload(downloadQueue){

    Object.values(GetSettings.General().map((key, index)=>{
        switch (index){
            
            // global_enable_save_as_window
            case 1:
                if (key.value == true){
                    downloadQueue.forEach((dq)=>{
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
                        chrome.downloads.download({
                            url: dq.url,
                            filename: dq.filename,
                            saveAs: false
                        }, function(dl){
                            console.log("bytes: " + dl.by)
                        });
                    });

                    chrome.Download
                }
                break;
        }
    }));
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

            let generalSettings = GetSettings.General();

            generalSettings.map((key, index) => {
                switch (index){
                    case 0:
                        if (key.value){
                            chrome.downloads.showDefaultFolder();
                        }
                        break;
                }
            });

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
})

