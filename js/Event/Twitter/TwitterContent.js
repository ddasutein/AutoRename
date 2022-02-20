/** MIT License
 * 
 * Copyright (c) 2022 Dasutein
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

    chrome.tabs.create({
        url: updatedUrl
    });
}

function SaveTwitterMedia(tabUrl, url, linkUrl, customObj){

    if (Utility.SplitURL(tabUrl, 5) == null || Utility.SplitURL(tabUrl, 5).length == 0){

        if (!linkUrl){
            alert(chrome.i18n.getMessage("error_tweet_detail_alert_prompt"));
            return;
        }
        
    }

    function buildFileName(fileNameObj){
        let temp;
        temp = `{prefix}-{website_title}-{username}-{tweetId}-{date}-{randomstring}`;
        temp = temp.split("-");

        const twitterConfig = Settings.Load().Twitter.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        
        if (!twitterConfig["twitter_include_mention_symbol"].value){
            temp[temp.indexOf("{username}")] = fileNameObj.username;
        } else {
            temp[temp.indexOf("{username}")] = `@${fileNameObj.username}`;
        }

        if (!twitterConfig["twitter_include_tweet_id"].value){
            Utility.RemoveUnusedParameter(temp, "{tweetId}");
        } else {
            temp[temp.indexOf("{tweetId}")] = fileNameObj.tweetId;
        }

        if (!twitterConfig["twitter_include_website_title"].value){
            Utility.RemoveUnusedParameter(temp, "{website_title}");
        } else {
            temp[temp.indexOf("{website_title}")] = "Twitter";
        }

        if (!twitterConfig["twitter_include_date"].value){
            Utility.RemoveUnusedParameter(temp, "{date}");
        } else {
            let prefObj = {};

            if (twitterConfig["twitter_prefer_locale_format"].value == true){
                prefObj["prefer_locale_format"] = true;
                const timedateValue = getTimeDate(prefObj);
                temp[temp.indexOf("{date}")] = timedateValue;
            } else {

                prefObj["prefer_locale_format"] = false;

                if (twitterConfig["twitter_date_format"].value == "custom"){
                    prefObj["date_format"] = twitterConfig["twitter_settings_custom_date_format"].value;
                } else {
                    prefObj["date_format"] = GetDateFormat(twitterConfig["twitter_date_format"].value);
                }

                const timedateValue = getTimeDate(prefObj)
                temp[temp.indexOf("{date}")] = timedateValue;

            }

        }

        if (twitterConfig["twitter_random_string_length"].value == "0"){
            Utility.RemoveUnusedParameter(temp, "{randomstring}");
        } else {
            temp[temp.indexOf("{randomstring}")] = Utility.GenerateRandomString(twitterConfig["twitter_random_string_length"].value);
        }

        if (customObj.use_prefix == true){

            if (twitterConfig["twitter_settings_custom_prefix"].value == ""){
                Utility.RemoveUnusedParameter(temp, "{prefix}");
            } else {
                temp[temp.indexOf("{prefix}")] = twitterConfig["twitter_settings_custom_prefix"].value;
            }

        } else {
            Utility.RemoveUnusedParameter(temp, "{prefix}");
        }

        return temp.toString().replace(/,/g, "-");
    }

    let twitterImageFile = [];
    let fileNameObj = {};
    let twitterMediaSrc;
    let tweetId;
    const specialCharacters = /[?!@#$%^&*(),';:*-.]/g;

    // Rule 1: When full tweet is clicked then it should be prioritized first
    if (!!tabUrl){
        if (specialCharacters.test(Utility.SplitURL(tabUrl, 5))){
            tweetId = Utility.SplitURL(tabUrl, 5).split(specialCharacters)[0];
        } else {
            tweetId = Utility.SplitURL(tabUrl, 5);
        }
    } 
    
    // Rule 2: If Tweet ID is still empty then retrieve it from linkUrl
    if (tweetId == "" || tweetId == undefined || tweetId == null){
        if (!!linkUrl){
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
    
    DevMode ? console.log(twitterImageFile) : "";
    StartDownload(twitterImageFile);

}