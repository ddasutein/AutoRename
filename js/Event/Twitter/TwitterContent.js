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
let getImageFormat = ((url) => url.split("?format=")[1].substring(0, 3));

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

function SaveTwitterMedia(tabUrl, url) {

    let fileName;
    let fileNameBuilderArray = [];
    let tweetId = SplitURL(tabUrl, 5);

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

        IncludeMentionSymbol = ((bool) => bool ? fileNameBuilderArray.push("@" + SplitURL(tabUrl, 3)) : fileNameBuilderArray.push(SplitURL(tabUrl, 3)));
        IncludeTweetID = ((bool) => bool ? fileNameBuilderArray.push(tweetId) : false);
        IncludeDate = ((bool, settings) => {
            settings.filter((x) => {
                return x.key === "dateFormatting"
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