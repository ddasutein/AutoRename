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

//#region CONTEXT MENU ITEMS

/**
 * Context menu items. When adding new context menu items, declare them here first
 */
const contextMenuId = {
    saveImage: "saveImage",
    saveImageWithCustomPrefix: "saveImageWithCustomPrefix",
    viewOriginalImage: "viewOriginalImage"
}

chrome.runtime.onInstalled.addListener(()=>{

    //#region Common context menu items
    chrome.contextMenus.create({
        id: contextMenuId.saveImage,
        title: chrome.i18n.getMessage("context_menu_save_image_as"),
        contexts: ["image"]
    },  () => chrome.runtime.lastError );
    
    chrome.contextMenus.create({
        id: contextMenuId.saveImageWithCustomPrefix,
        title: "Save image as (AutoRename) with Prefix",
        contexts: ["image"]
    },  () => chrome.runtime.lastError );
    
    //#endregion
    
    //#region Twitter specific context menu
    chrome.contextMenus.create({
        id: contextMenuId.viewOriginalImage,
        title: chrome.i18n.getMessage("context_menu_view_original_image"),
        contexts: ["image"]
    }, () => chrome.runtime.lastError );

    //#endregion
});

//#endregion

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
    console.log(activeInfo.tabId)

    QueryTab(activeInfo);

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


chrome.action.setBadgeBackgroundColor({
    color: "#181818"
});

const setBadgeText = ((str) => {
    chrome.action.setBadgeText({
        text: str.toString()
    })
});


let count = 0;
/**
 * Queries tab data
 */
function QueryTab(tabData) {

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
            DevMode ? console.log(url) : "";
            UpdateContextMenus(url, tabs[0].url);

            BrowserTabInfo.Title = title;
            BrowserTabInfo.URL = url;
            DevMode ? console.log(BrowserTabInfo) : "";
        }));

    }, 500);

};

/**
 * Here you can dynamically set which websites can use a specific context menu item.
 * It is important that the user should not see a context menu for the extension if
 * the website is not supported.
 * 
 * @param {string} url URL of the website
 */
function UpdateContextMenus(url, urlFull) {

    switch(url){
        case Website.Twitter:
            
            if (urlFull.includes("messages")){
                chrome.contextMenus.update(contextMenuId.saveImage, {
                    visible: false
                });
    
                chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                    visible: false 
                });
    
                chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                    visible: false
                });
                return;
            }

            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: true 
            });

            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;
            
        case Website.Mobile_Twitter:

            if (urlFull.includes("messages")){
                chrome.contextMenus.update(contextMenuId.saveImage, {
                    visible: false
                });
    
                chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                    visible: false 
                });
    
                chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                    visible: false
                });
                return;
            }

            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: true 
            });

            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;

        case Website.LINE_BLOG:

            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: false 
            });

            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;

        case Website.Reddit:
            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: false 
            });

            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;

        case Website.Reddit_Old:
            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: false 
            });

            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;

        case Website.Reddit_New:
            chrome.contextMenus.update(contextMenuId.saveImage, {
                visible: true
            });

            chrome.contextMenus.update(contextMenuId.viewOriginalImage, {
                visible: false 
            });

            
            chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                visible: true
            });
            break;

        default:
            
            if (Object.keys(Website).map(key => Website[key]).indexOf(url) == -1){
                DevMode ? console.log("website not supported. removing context menu items") : "";

                chrome.contextMenus.update("viewOriginalImage", {
                    visible: false 
                });

                chrome.contextMenus.update(contextMenuId.saveImage, {
                    visible: false
                });

                chrome.contextMenus.update(contextMenuId.saveImageWithCustomPrefix, {
                    visible: false
                });
                
            } else {
                DevMode ? console.log("add saveImage context menu item") : "";
                chrome.contextMenus.update(contextMenuId.saveImage, {
                    visible: true
                });
            }
            break;
    }    
};

/**
 * This is the ENTRY point to trigger saving images or to execute specific
 * context menu items. If you need to add new websites, add a new case
 * statement. Then you should also create a specific JavaScript file for that
 * website you are trying to support
 */
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let currentUrl = tab.url;
    let temp = {};
    currentUrl = currentUrl.split("/");
    currentUrl = currentUrl[2];

    switch (currentUrl) {
        case Website.Twitter:

            if (info.menuItemId === contextMenuId.viewOriginalImage){
                ViewOriginalMedia(info.srcUrl);
                return;
            } 
            else if (info.menuItemId === contextMenuId.saveImage){
                temp["use_prefix"] = false;
                SaveTwitterMedia(tab.url, info.srcUrl, info.linkUrl, temp);

            } else if (info.menuItemId == contextMenuId.saveImageWithCustomPrefix){
                temp["use_prefix"] = true;
                SaveTwitterMedia(tab.url, info.srcUrl, info.linkUrl, temp)
            }
            break;

        case Website.Mobile_Twitter: 
            if (info.menuItemId === contextMenuId.viewOriginalImage){
                ViewOriginalMedia(info.srcUrl);
                return;
            } 
            else if (info.menuItemId === contextMenuId.saveImage){
                SaveTwitterMedia(tab.url, info.srcUrl, info.linkUrl);

            }
            break;

        case Website.LINE_BLOG:
            if (info.menuItemId == contextMenuId.saveImage){
                temp["use_prefix"] = false;
                SaveLINEBlogMedia(tab.url, info.srcUrl, temp);
            } else if (info.menuItemId == contextMenuId.saveImageWithCustomPrefix){
                temp["use_prefix"] = true;
                SaveLINEBlogMedia(tab.url, info.srcUrl, temp);
            }
            break;

        case Website.Reddit:
            
            if (info.menuItemId == contextMenuId.saveImage){
                temp["use_prefix"] = false;
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, temp);
            } else if (info.menuItemId == contextMenuId.saveImageWithCustomPrefix){
                temp["use_prefix"] = true;
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, temp);
            }
   
            break;

        case Website.Reddit_Old:
            if (info.menuItemId == contextMenuId.saveImage){
                temp["use_prefix"] = false;
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, temp);
            } else if (info.menuItemId == contextMenuId.saveImageWithCustomPrefix){
                temp["use_prefix"] = true;
                SaveRedditMedia(tab.url, info.srcUrl, info.linkUrl, temp);
            }

            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});