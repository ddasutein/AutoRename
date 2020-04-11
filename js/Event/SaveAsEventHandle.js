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

/* ---------------------CONTEXT MENU ITEMS----------------------- */
chrome.contextMenus.create({
    "id": "saveImage",
    "title": chrome.i18n.getMessage("context_menu_save_image_as"),
    "contexts": ["image"]
});

// Twitter Specific Context Menu Item
const viewOriginalImageSizeContextMenuItem = chrome.contextMenus.create({
    "id": "viewOriginalImageSizeContextMenuItem",
    "title": chrome.i18n.getMessage("context_menu_view_original_image"),
    "contexts": ["image"],
    "visible": false
});

/* ----------END OF CONTEXT MENU ITEMS FUNCTIONS------------------ */

/* Enums of Supported sites by this extension */
const Website = {
    Twitter: 'twitter.com',
    Instagram: 'instagram.com',
    Facebook: 'facebook.com',
    Reddit: 'reddit.com',
    LINE_BLOG: 'lineblog.me',
    LINE_BLOG_CDN: 'obs.line-scdn.net'
}

/* Paramaters to build file name*/
let FileNameBuilder = {
    username: null,
    tweetId: null,
    randomString: null,
    fileExtension: null,
    timeanddate: null
};

/* Setup file name to return final file name */
function CreateFileName() {
    const username = FileNameBuilder.username;
    const tweetid = FileNameBuilder.tweetId;
    const randomString = FileNameBuilder.randomString;
    const fileExtension = FileNameBuilder.fileExtension;
    const _timeanddate = FileNameBuilder.timeanddate;
    let finalFileName = "";

    if (tweetid === "") {
        finalFileName = username + "-" + randomString + _timeanddate + fileExtension;
    } else {
        finalFileName = username + "-" + tweetid + "-" + randomString + _timeanddate + fileExtension;
    }
    return finalFileName;
}

/* Listens for URL from address bar when browser window is opened or entering a new URL */
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){

    if (changeInfo.status == "complete"){
        if (DevMode){
            const DEBUG_TAG = "tabsOnUpdated => ";
            console.log(DEBUG_TAG + tab.url + " " + tab.title);           
        }

        switch(SplitURL(tab.url, 2)){
            case Website.LINE_BLOG:
                LINEBLOGTitle(tab.title);
                break;
        }

        ToggleViewOriginalImageContextMenuVisibility(tab.url)
    }
});

/* Listens for tab change by the user */
chrome.tabs.onActiveChanged.addListener(function(){

    chrome.tabs.query({
        "active": true,
        "currentWindow": true},

        function(tabs){
            if (DevMode){
                const DEBUG_TAG = "tabsOnActiveChanged => ";
                console.log(DEBUG_TAG + tabs[0].url);
            }
            ToggleViewOriginalImageContextMenuVisibility(tabs[0].url);            
        },
    );
});

function ToggleViewOriginalImageContextMenuVisibility(url){
    const currentUrl = url;
    const currentUrlSplit = currentUrl.split("/");
    const currentWebsite = currentUrlSplit[2];
    
    switch(currentWebsite){
        case Website.Twitter:
            chrome.contextMenus.update(viewOriginalImageSizeContextMenuItem, {
                "visible": true 
                });
            break;
        default:
            chrome.contextMenus.update(viewOriginalImageSizeContextMenuItem, {
                "visible": false 
                });
            break;
    }    
}

/* Execute everything when save image as is clicked. */
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    const currentUrl = tab.url;
    const currentUrlSplit = currentUrl.split("/");
    const currentWebsite = currentUrlSplit[2];

    switch (currentWebsite) {
        case Website.Twitter:

            if (info.menuItemId === "viewOriginalImageSizeContextMenuItem"){
                ParseOriginalMediaUrl(info.srcUrl);
                ViewTwitterOriginalImageTab();
                return;
            } 
            else if (info.menuItemId === "saveImage"){
                SaveTwitterImage(info, currentUrlSplit);
            }
            break;
        case Website.LINE_BLOG:
            LineBlogURL(info.srcUrl, tab.url);
            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});

/* ---------------------FUNCTIONS FOR TWITTER------------------------ */


function ViewTwitterOriginalImageTab(){
    window.open(finalUrlOutput, "_blank");
}

function SaveTwitterImage(info, urlSplit) {
    chrome.storage.local.get({
        fileNameStringLength: "8",
        showMentionSymbol: true,
        showTweetId: true,
        twitterFileExtensionType: ".jpg",
        useDate: false,
        dateFormatting: "0"
    }, function (items) {
        
        showMentionSymbol = items.showMentionSymbol;
        showTweetId = items.showTweetId;
        useDate = items.useDate;

        const twitterUsername = urlSplit[3];
        const tweetId = urlSplit[5];
        FileNameBuilder.fileExtension = items.twitterFileExtensionType;

        // Check if the URL has a tweet id
        if (tweetId == null || tweetId.length == 0){
            alert(chrome.i18n.getMessage("error_tweet_detail_alert_prompt"));
            return;          
        } else {
            showMentionSymbol ? FileNameBuilder.username = "@" + twitterUsername : FileNameBuilder.username = twitterUsername;
            showTweetId ? FileNameBuilder.tweetId = checkSpecialChars(tweetId) : FileNameBuilder.tweetId = "";
            useDate ? FileNameBuilder.timeanddate = GetDateFormat(items.dateFormatting) : FileNameBuilder.timeanddate = "";
            FileNameBuilder.randomString = GenerateRandomString(items.fileNameStringLength);
            
            ParseOriginalMediaUrl(info.srcUrl);
            StartDownload(Website.Twitter, finalUrlOutput, CreateFileName());
        }

        function checkSpecialChars(idStr){
            if (idStr.includes("?s")){
                return idStr.substring(0, idStr.lastIndexOf("?s") + 0);
            } else {
                return idStr;
            }
        }
    });
}

let finalUrlOutput = null;

function ParseOriginalMediaUrl(url){

    const originalUrl = url;
    const twitterLargeImage = "&name=orig";
    const getTwitterImageFormat = originalUrl.substring(0, originalUrl.lastIndexOf("&name=") + 0);
    const updatedUrl = getTwitterImageFormat + twitterLargeImage;
    let finalImageSource = null;

    const regex_size = "&name=";
    
    if (originalUrl.includes(regex_size)){
        // If the user is using the Redesign
        finalImageSource = updatedUrl;
    }else {
        // If user is on the legacy design
        finalImageSource = originalUrl;
    }

    if (DevMode){
        const DEBUG_TAG = "ParseOriginalMediaUrl => ";
        console.log(DEBUG_TAG + "original_url: " + originalUrl);
        console.log(DEBUG_TAG + "final_url: " + finalImageSource);
    }

    finalUrlOutput = finalImageSource;
}

/* ---------------------END OF TWITTER FUNCTIONS------------------------ */