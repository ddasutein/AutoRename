/** MIT License
 * 
 * Copyright (c) 2019 Dasutein
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
  * Start downloading file
  * @param {String} website
  * @param {String} url 
  * @param {String} filename 
  */
function StartDownload(website, url, filename){
    switch (website){

        case Website.Twitter:
            launchDownload(url, filename);
            break;
        case Website.LINE_BLOG:
            launchDownload(url, filename);
            break;            
    }

    function launchDownload(url, filename){
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
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

            if (items.showDownloadFolderCheckbox === true) {
                chrome.downloads.showDefaultFolder();
            }
            return;
        }
    });
});