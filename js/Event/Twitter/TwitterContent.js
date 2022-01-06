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

function SaveTwitterMedia(tabUrl, url, linkUrl){

    if (Utility.SplitURL(tabUrl, 5) == null || Utility.SplitURL(tabUrl, 5).length == 0){

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
                    temp[temp.indexOf("{string}")] = Utility.GenerateRandomString(key.value)
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

                case 5:
                    if (!key.value){
                        idx = temp.indexOf("Twitter");
                        if (idx > -1){
                            temp.splice(idx, 1)
                        }
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
        if (specialCharacters.test(Utility.SplitURL(tabUrl, 5))){
            tweetId = Utility.SplitURL(tabUrl, 5).split(specialCharacters)[0];
        } else {
            tweetId = Utility.SplitURL(tabUrl, 5);
        }
    } 
    
    // Rule 2: If Tweet ID is still empty then retrieve it from linkUrl
    if (tweetId == "" || tweetId == undefined || tweetId == null){
        if (!!linkUrl){
            console.log("link url " + linkUrl);
            if (specialCharacters.test(Utility.SplitURL(linkUrl, 5))){
                tweetId = Utility.SplitURL(linkUrl, 5).split(specialCharacters)[0];
            } else {
                tweetId = Utility.SplitURL(linkUrl, 5);
            }
        }
    }
    fileNameObj["username"] = linkUrl != undefined ? Utility.SplitURL(linkUrl, 3) : Utility.SplitURL(tabUrl, 3);
    fileNameObj["tweetId"] = tweetId;
    twitterMediaSrc = url.substring(0, url.lastIndexOf("&name=") + 0) + size.original;
    twitterImageFile.push({
        filename: buildFileName(fileNameObj) + getImageFormat(url),
        url: twitterMediaSrc
    });
    console.log(twitterImageFile)
    StartDownload(twitterImageFile);

}