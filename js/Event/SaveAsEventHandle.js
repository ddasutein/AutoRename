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
    Mobile_Twitter: 'mobile.twitter.com',
    Instagram: 'instagram.com',
    Facebook: 'facebook.com',
    Reddit: 'reddit.com',
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
                SaveTwitterMedia(tab.url, info.srcUrl);

            }
            break;
        case Website.Mobile_Twitter: 
            if (info.menuItemId === "viewOriginalImageSizeContextMenuItem"){
                ViewOriginalMedia(info.srcUrl);
                return;
            } 
            else if (info.menuItemId === "saveImage"){
                SaveTwitterMedia(tab.url, info.srcUrl);

            }
        break;
        case Website.LINE_BLOG:
            SaveLINEBLOGMedia(tab.url, info.srcUrl);
            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});
