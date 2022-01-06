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

/* ---------------------CONTEXT MENU ITEMS----------------------- */

chrome.runtime.onInstalled.addListener(()=>{
    chrome.contextMenus.create({
        id: "saveImage",
        title: chrome.i18n.getMessage("context_menu_save_image_as"),
        contexts: ["image"]
    });
    
    chrome.contextMenus.create({
        id: "saveImageWithCustomPrefix",
        title: "Save image as (AutoRename) with custom tag",
        contexts: ["image"]
    });
    
    chrome.contextMenus.create({
        id: "saveImageWithCustomPrefix2",
        title: "Save image as (AutoRename) with predefined tag",
        contexts: ["image"]
    });
    
    // Twitter Specific Context Menu Item
    chrome.contextMenus.create({
        id: "viewOriginalImageSizeContextMenuItem",
        title: chrome.i18n.getMessage("context_menu_view_original_image"),
        contexts: ["image"]
    });
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
let BrowserTabInfo = {
    Title: "",
    URL: ""
}

/**
 * When the user changes tabs, the extension should be able to grab
 * the URL and Title
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
    
    DevMode ? console.log("tabs onActivated") : "";
    QueryTab();

});

/**
 * When the user clicks a link on the same tab, the extension should be able to
 * get the updated data.
 */
chrome.tabs.onUpdated.addListener((tabId, selectInfo) => {
    DevMode ? console.log("-- on update --") : ""

    if (selectInfo.status == "complete"){
        QueryTab();
    }

});

function QueryTab() {

    setTimeout(() => {

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, ((tabs)=>{

            let url;
            let title;  

            if (tabs[0] != undefined){
                DevMode ? console.log(BrowserTabInfo) : "";
                url = tabs[0].url;
                title = tabs[0].title;
            }

            url = url.split("/");
            url = url[2];
            console.log(url);
            UpdateContextMenus(url);

            BrowserTabInfo.Title = title;
            BrowserTabInfo.URL = url;
            console.log(BrowserTabInfo)
        }));

    }, 500);

};

function UpdateContextMenus(url) {

    switch(url){
        case Website.Twitter:

            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": true 
                });
            break;
            
        case Website.Mobile_Twitter:

            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": true 
                });
            break;

        case Website.LINE_BLOG:

            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": false 
            });
            break;

        case Website.Reddit:
            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": false 
            });
            break;

        case Website.Reddit_Old:
            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": false 
            });
            break;

        case Website.Reddit_New:
            chrome.contextMenus.update("saveImage", {
                visible: true
            });

            chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                "visible": false 
            });
            break;

        default:
            
            if (Object.keys(Website).map(key => Website[key]).indexOf(url) == -1){
                DevMode ? console.log("website not supported. removing context menu items") : "";

                chrome.contextMenus.update("viewOriginalImageSizeContextMenuItem", {
                    "visible": false 
                });

                chrome.contextMenus.update("saveImage", {
                    visible: false
                });
                
            } else {
                DevMode ? console.log("add saveImage context menu item") : "";
                chrome.contextMenus.update("saveImage", {
                    visible: true
                });
            }
            break;
    }    
};

/* Execute everything when save image as is clicked. */
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let currentUrl = tab.url;
    currentUrl = currentUrl.split("/");
    currentUrl = currentUrl[2];

    switch (currentUrl) {
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
            SaveLINEBlogMedia(tab.url, info.srcUrl);
            break;

        case Website.Reddit:
            SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl);
   
            break;

        case Website.Reddit_Old:
            SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl);

            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});