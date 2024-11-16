/** MIT License
 * 
 * Copyright (c) 2024 Dasutein
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


function QueryTab(tabData) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, ((tabs)=>{

        let url;
        let title;  

        if (tabs[0] != undefined){
            
            url = tabs[0].url;
            title = tabs[0].title;
        }

        url = url.split("/");
        url = url[2];

        UpdateContextMenus(url, tabs[0].url);

    }));

};

/**
 * Here you can dynamically set which websites can use a specific context menu item.
 * It is important that the user should not see a context menu for the extension if
 * the website is not supported.
 * 
 * @param {string} url URL of the website
 */


function UpdateContextMenus(domain, fullURL){

    if ( (domain == undefined || domain == null || domain == "") || fullURL.includes("chrome-extension://")){
        return;
    }

    if (domain.includes("www")){
        domain = domain.replace(/^www\./g, "");
    }

    const SetContextMenuVisibility = {

        Normal : ((uri, fullURL) => {

            let websiteConfigObject = WebsiteConfigObject.filter((x)=>{
                return (x.uri).includes(uri) && x.inactive == false;
            });

            if (websiteConfigObject.length != 0){

                let blockedByExcludedPath = false;

                // Step 1: Check if we need to hide any additional paths on the website. For example,
                // we don't want the extension to show context menus items if user is in Twitter DMs.
                // Then set a flag to stop from further execution if path is detected
                excludedPaths = websiteConfigObject.map((x) => {
                    return x.exclude_path;
                });
                if (excludedPaths.length != 0){
                    let domain = fullURL.split("/");

                    excludedPaths[0].forEach((x) => {
                        if (domain.includes(x)){
                            SetContextMenuVisibility.HideAll();
                            blockedByExcludedPath = true;
                        }
                    });
                }
                
                if (blockedByExcludedPath == true) return;

                // Step 2: Then proceed to check base domain
                websiteConfigObject = websiteConfigObject.map((x)=>{
                    return x.allowed_context_menu_items;
                })[0];
                
                Object.values(ContextMenuID).forEach((CMID) => {
                    
                    let hasContextMenuItem = websiteConfigObject.some((x => x == CMID));
                    if (hasContextMenuItem == true){
                        chrome.contextMenus.update(CMID, {
                            visible: true
                        });
                    } else {
                        SetContextMenuVisibility.Hide(CMID);
                    }
                });

            } else {
                SetContextMenuVisibility.HideAll();
            }
        }),

        Hide: ((CMID) => {
            chrome.contextMenus.update(CMID, {
                visible: false
            });
        }),

        HideAll : (() => {
            for (let i of Object.values(ContextMenuID)){
                chrome.contextMenus.update(i, {
                    visible: false
                });
            }
        })
    }

    if (Object.values(Website).some((wb => wb == domain)) == true){
        SetContextMenuVisibility.Normal(domain, fullURL);
    } else {
        SetContextMenuVisibility.HideAll();
    }
}


const ContextMenuID = {
    SaveImage: "saveImage",
    SaveImageWithPrefix: "saveImageWithCustomPrefix",
    ViewOriginalImage: "viewOriginalImage",
    AddDownloadQueue: "downloadqueue"
}

chrome.runtime.onInstalled.addListener(()=>{

    chrome.contextMenus.create({
        id: ContextMenuID.SaveImage,
        title: chrome.i18n.getMessage("context_menu_save_image_as"),
        contexts: ["image"]
    },  () => chrome.runtime.lastError );
    
    chrome.contextMenus.create({
        id: ContextMenuID.SaveImageWithPrefix,
        title: "Save image as (AutoRename) with Prefix",
        contexts: ["image"]
    },  () => chrome.runtime.lastError );

    chrome.contextMenus.create({
        id: ContextMenuID.AddDownloadQueue,
        title: chrome.i18n.getMessage("common_add_to_download_queue"),
        contexts: ["image"]
    },  () => chrome.runtime.lastError );
    
    chrome.contextMenus.create({
        id: ContextMenuID.ViewOriginalImage,
        title: chrome.i18n.getMessage("context_menu_view_original_image"),
        contexts: ["image"]
    }, () => chrome.runtime.lastError );

    DownloadManager.UpdateBadge();

});

/* Enums of Supported sites by this extension */
const Website = {
    Twitter: 'twitter.com',
    Mobile_Twitter: 'mobile.twitter.com',
    Instagram: 'instagram.com',
    Facebook: 'facebook.com',
    Reddit: 'reddit.com',
    Reddit_New: 'new.reddit.com',
    Reddit_Old: 'old.reddit.com',
    LINE_BLOG: 'lineblog.me',
    LINE_BLOG_CDN: 'obs.line-scdn.net',
    Threads: "threads.net",
    X: "x.com",
    Bluesky: "bsky.app"
}

/**
 * Configure parameters for websites
 * 
 * URI                          = Base URL of the website
 * Exclude Path                 = Add which path in the URL you want to hide the context menu item from appearing.
 * Inactive                     = Whether or not to display the context menu for that website even if they are added in this array.
 * allowed_context_menu_items   = Add/Remove context menu items here
 * file_name                    = This is still in beta for version 4.1.0. Will expand on this idea in the future
 */
const WebsiteConfigObject = [
    {
        uri: [Website.Twitter, Website.Mobile_Twitter, Website.X],
        exclude_path: ["messages"],
        inactive: false,
        allowed_context_menu_items: [ContextMenuID.SaveImage, ContextMenuID.SaveImageWithPrefix, ContextMenuID.ViewOriginalImage, ContextMenuID.AddDownloadQueue],
        file_name: ""
    }, {
        uri: [Website.Bluesky],
        exclude_path: [],
        inactive: true,
        allowed_context_menu_items: [ContextMenuID.SaveImage, ContextMenuID.SaveImageWithPrefix, ContextMenuID.ViewOriginalImage],
        file_name: ""
    }, {
        uri: [Website.Reddit, Website.Reddit_New, Website.Reddit_Old],
        exclude_path: [],
        inactive: false,
        allowed_context_menu_items: [ContextMenuID.SaveImage, ContextMenuID.SaveImageWithPrefix, ContextMenuID.ViewOriginalImage, ContextMenuID.AddDownloadQueue],
        file_name: ""
    }, {
        uri: [Website.Threads],
        exclude_path: [],
        inactive: false,
        allowed_context_menu_items: [ContextMenuID.SaveImage, ContextMenuID.SaveImageWithPrefix, ContextMenuID.ViewOriginalImage],
        file_name: "{prefix}-{website_title}-{attrib1}-{attrib2}-{date}-{randomstring}"
    }
];

/**
 * When the user changes tabs, the extension should be able to grab
 * the URL and Title
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
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

/**
 * This is the ENTRY point to trigger saving images or to execute specific
 * context menu items. If you need to add new websites, add a new case
 * statement. Then you should also create a specific JavaScript file for that
 * website you are trying to support
 */
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let currentUrl = tab.url;
    currentUrl = currentUrl.split("/");
    currentUrl = currentUrl[2];
    currentUrl = currentUrl.replace(/^www\./g, "");

    let data = {};
    data["tab_url"] = tab.url;
    data["info_url"] = info.srcUrl;
    data["link_url"] = info.linkUrl;

    /**
     * When websites are hardcoded in the Switch statement, these are natively
     * supported features by the extension. In the future, for non-native
     * support for websites, they should fall under the default statement. Note,
     * if the website contains subdomains then it should be grouped together.
     */

    console.log(currentUrl);
    switch (currentUrl) {
        case Website.Mobile_Twitter:
        case Website.X:
        case Website.Twitter:
        case Website.Mobile_Twitter:
        case Website.X:
            Twitter.SaveMedia(data, info.menuItemId);
            break;

        case Website.Reddit:
        case Website.Reddit_Old:
            Reddit.SaveMedia(data, info.menuItemId);
   
            break;

        case Website.Threads:
            console.log("enter threads")
            Threads.SaveMedia(data, info.menuItemId);
            break;

        case Website.Bluesky:
            BlueSky.SaveMedia(data, info.menuItemId);
            break;

        default:
            break;
    }

});