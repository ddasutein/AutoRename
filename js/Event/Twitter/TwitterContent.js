/** MIT License
 * 
 * Copyright (c) 2020 Dasutein
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
 * Twitter supports various image sizes. When using `original`,
 * the extension can save images up to 4096x4096 resolution
 */
 const size = {
    small: "&name=small",
    medium: "&name=medium",
    large: "&name=large",
    original: "&name=orig"
}

/**
 * Return if the image is either a JPG or PNG
 * 
 * @param {string} url 
 */
let getImageFormat = ((url) => "." + url.split("?format=")[1].substring(0, 3));

/**
 * View the Twitter image in it's original size
 * 
 * @param {string} url 
 */
function ViewOriginalMedia(url) {

    let updatedUrl = null;

    const twitterImageSize = url.substring(0, url.lastIndexOf("&name=") + 0);

    if (url.includes("&name=")) {
        updatedUrl = twitterImageSize + size.original
    } else {
        updatedUrl = url;
    }

    window.open(updatedUrl, "_blank");
}

function SaveTwitterMediaV2(tabUrl, url, linkUrl){

    if (SplitURL(tabUrl, 5) == null || SplitURL(tabUrl, 5).length == 0){

        if (!linkUrl){
            alert(chrome.i18n.getMessage("error_tweet_detail_alert_prompt"));
            return;
        }
        
    }

    function buildFileName(fileNameObj){
        let temp;
        let isUsingDateFormat;
        temp = `Twitter-{username}-${fileNameObj.tweetId}-{date}-{string}`;
        temp = temp.split("-");
        console.log(temp);
        Object.values(SettingsArray.filter((key)=>{
            return key.category == CategoryEnum.Twitter
        }).map((key, index)=>{
            switch (index) {

                // twitter_include_mention_symbol
                case 0:
                    if (!key.value){
                        temp[temp.indexOf("{username}")] = fileNameObj.username;
                    } else {
                        temp[temp.indexOf("{username}")] = `@${fileNameObj.username}`;
                    }
                    break;

                // twitter_include_tweet_id
                case 1:
                    if (!key.value){
                        idx = temp.indexOf(fileNameObj.tweetId);
                        if (idx > -1){
                            temp.splice(idx, 1)
                        }
                    }
                    break;

                // twitter_random_string_length
                case 2:
                    temp[temp.indexOf("{string}")] = GenerateRandomString(key.value)
                    break;

                // twitter_include_date
                case 3:
                    if (!key.value){
                        isUsingDateFormat = false;
                        idx = temp.indexOf("{date}");
                        if (idx > -1){
                            temp.splice(idx, 1);
                        }
                    } else {
                        isUsingDateFormat = true
                    }
                    break;
                    
                // twitter_date_format
                case 4:
                    console.log(isUsingDateFormat)
                    if (isUsingDateFormat){
                        temp[temp.indexOf("{date}")] = GetDateFormat(key.value);
                    }
                    break;
            }
        }));
        console.log(temp)
        return temp.toString().replace(/,/g, "-");
    }

    let twitterImageFile = [];
    let fileNameObj = {};
    let twitterMediaSrc;
    let tweetId;
    const specialCharacters = /[?!@#$%^&*(),';:*-.]/g;

    // Rule 1: When full tweet is clicked then it should be prioritized first
    if (!!tabUrl){
        console.log('tab url ' + tabUrl);
        if (specialCharacters.test(SplitURL(tabUrl, 5))){
            tweetId = SplitURL(tabUrl, 5).split(specialCharacters)[0];
        } else {
            tweetId = SplitURL(tabUrl, 5);
        }
    } 
    
    // Rule 2: If Tweet ID is still empty then retrieve it from linkUrl
    if (tweetId == "" || tweetId == undefined || tweetId == null){
        if (!!linkUrl){
            console.log("link url " + linkUrl);
            if (specialCharacters.test(SplitURL(linkUrl, 5))){
                tweetId = SplitURL(linkUrl, 5).split(specialCharacters)[0];
            } else {
                tweetId = SplitURL(linkUrl, 5);
            }
        }
    }

    fileNameObj["username"] = SplitURL(linkUrl, 3);
    fileNameObj["tweetId"] = tweetId;
    twitterMediaSrc = url.substring(0, url.lastIndexOf("&name=") + 0) + size.original;
    twitterImageFile.push({
        filename: buildFileName(fileNameObj) + getImageFormat(url),
        url: twitterMediaSrc
    });
    console.log(twitterImageFile)
    StartDownloadV2(twitterImageFile);

}

function SaveTwitterMedia(tabUrl, url, linkUrl) {

    let fileName;
    let fileNameBuilderArray = [];
    let tweetId = SplitURL(tabUrl, 5);
    let save_image_not_full_view = false;

    if (tweetId == null || tweetId.length == 0){
        if (!!linkUrl){
            tweetId = SplitURL(linkUrl, 5);
            save_image_not_full_view = true;
        }
    }

    try {
        if (tweetId == null || tweetId.length == 0) {
            alert(chrome.i18n.getMessage("error_tweet_detail_alert_prompt"));
            return;
        }
        const specialCharacters = /[?!@#$%^&*(),';:*-.]/g;
        if (specialCharacters.test(tweetId)) {
            tweetId = tweetId.split(specialCharacters)[0];
        }

        let twitterSettings = SettingsArray.filter(function (key) {
            return key.category == CategoryEnum.Twitter
        });

        IncludeMentionSymbol = ((bool) => {
            if (bool == true){

                if (save_image_not_full_view == true){
                    fileNameBuilderArray.push("@" + SplitURL(linkUrl, 3));
                } else {
                    fileNameBuilderArray.push("@" + SplitURL(tabUrl, 3));
                }
                
            } else {

                if (save_image_not_full_view == true){
                    fileNameBuilderArray.push(SplitURL(linkUrl, 3));
                } else {
                    fileNameBuilderArray.push(SplitURL(tabUrl, 3));
                }

            }
        })

        IncludeTweetID = ((bool) => bool ? fileNameBuilderArray.push(tweetId) : false);
        IncludeDate = ((bool, settings) => {
            settings.filter((x) => {
                return x.key === "twitter_date_format"
            }).map((x) => {
                if (bool) {
                    fileNameBuilderArray.push(GetDateFormat(x.value));
                }
            });
        });

        twitterSettings.map((key, index) => {

            /**
             * To get index number, set DevMode to true in /js/Common/Debugger.js
             * Then open the browser console and type >> Debug.Settings("twitter")
             */

            switch (index) {
                case 0:
                    IncludeMentionSymbol(key.value);
                    break;
                case 1:
                    IncludeTweetID(key.value);
                    break;
                case 2:
                    fileNameBuilderArray.push(GenerateRandomString(key.value));
                    break;
                case 3:
                    IncludeDate(key.value, twitterSettings);
                    break;
            }
        });

        /** Prepare download sequence */
        fileName = fileNameBuilderArray.toString();
        fileName = fileNameBuilderArray.join(", ");
        fileName = fileName.replace(/, /g, "-") + "." + getImageFormat(url);

        let twitterMediaSrc = url.substring(0, url.lastIndexOf("&name=") + 0) + size.original;

        StartDownload(Website.Twitter, twitterMediaSrc, fileName);

        // Clear array when finished
        while (fileNameBuilderArray.length > 0) {
            DevMode ? console.log("Clearing fileNameBuilderArray... " + fileNameBuilderArray) : false;
            fileNameBuilderArray.pop();
            if (DevMode) {
                if (fileNameBuilderArray.length == 0) {
                    console.log("Done!");
                }
            }
        }
    } catch (Exception) {
        alert(`${chrome.i18n.getMessage("error_generic")} \n${Exception.toString().trim()} \n\n${chrome.i18n.getMessage("error_exception_reload")}`);

        chrome.tabs.getSelected(function (tab) {
            chrome.tabs.reload(tab.id);
        });
    }

}