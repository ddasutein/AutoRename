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

 /* --------------------------GLOBAL----------------------------- */
 /**
  * Determines if the user is viewing the post by itself or not
  */
var RedditMode = {
    Full_View: "full_view",
    Half_View: "half_view",
    Old_UI: "old_ui"
}
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
    Mobile_Twitter: 'mobile.twitter.com',
    Instagram: 'instagram.com',
    Facebook: 'facebook.com',
    Reddit: 'www.reddit.com',
    Reddit_New: 'new.reddit.com',
    Reddit_Old: 'old.reddit.com',
    LINE_BLOG: 'lineblog.me',
    LINE_BLOG_CDN: 'obs.line-scdn.net'
}

/**
 * Global parameters to store browser tab information. This can be called
 * on any part of the extension as needed
 */
var BrowserTabInfo = {
    Title: "",
    URL: ""
}

/* Listens for URL from address bar when browser window is opened or entering a new URL */
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){

    if (changeInfo.status == "complete"){
        if (DevMode){
            const DEBUG_TAG = "tabsOnUpdated => ";
            console.log(DEBUG_TAG + tab.url + " " + tab.title);           
        }
        BrowserTabInfo.URL = tab.url;
        BrowserTabInfo.Title = tab.title;
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

            BrowserTabInfo.URL = tabs[0].url;
            BrowserTabInfo.Title = tabs[0].title;
            
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
        case Website.Mobile_Twitter:
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
                ViewOriginalMedia(info.srcUrl);
                return;
            } 
            else if (info.menuItemId === "saveImage"){
                SaveTwitterMedia(tab.url, info.srcUrl, info.linkUrl);

            }
            break;
        case Website.Mobile_Twitter: 
            if (info.menuItemId === "viewOriginalImageSizeContextMenuItem"){
                ViewOriginalMedia(info.srcUrl);
                return;
            } 
            else if (info.menuItemId === "saveImage"){
                SaveTwitterMedia(tab.url, info.srcUrl, info.linkUrl);

            }
        break;
        case Website.LINE_BLOG:
            SaveLINEBLOGMedia(tab.url, info.srcUrl);
            break;

        case Website.Reddit:

            if (currentUrl.includes("comments")){
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, RedditMode.Full_View);
            } else {

                /**
                 * When the user has not opt in for the new Reddit design
                 * the linkUrl does not return the full post URL.
                 * So by doing this simple check, it can determine if the user is on
                 * old or new Reddit
                 */

                if (info.linkUrl.includes("comments")){
                    SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, RedditMode.Half_View);
                }
            }
            
            break;

        case Website.Reddit_New:

            if (currentUrl.includes("comments")){
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, RedditMode.Full_View);
            } else {
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, RedditMode.Half_View);
            }
            break;

        case Website.Reddit_Old:
            
            if (currentUrl.includes("comments")){
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, RedditMode.Full_View);
            }
            
            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});