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
    viewOriginalImage: "viewOriginalImage",
    addDownloadQueue: "downloadqueue"
}
Object.freeze(contextMenuId);


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

    chrome.contextMenus.create({
        id: contextMenuId.addDownloadQueue,
        title: chrome.i18n.getMessage("common_add_to_download_queue"),
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

    DownloadManager.UpdateBadge();

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
    LINE_BLOG_CDN: 'obs.line-scdn.net',
    Threads: "threads.net",
    X: "x.com"
}
Object.freeze(Website);


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


let count = 0;
/**
 * Queries tab data
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
        DevMode ? console.log(url) : "";
        UpdateContextMenus(url, tabs[0].url);

    }));

};

let WebsiteSupport = [
    {
        name: "Twitter",
        uris: ["twitter.com", "mobile.twitter.com", "m.twitter.com", "x.com"],
        context_menu_support: [contextMenuId.saveImage, contextMenuId.saveImageWithCustomPrefix, contextMenuId.viewOriginalImage, contextMenuId.addDownloadQueue],
        other_exclusions: ["messages"],
        placeholder: "{prefix}-{website_title}-{username}-{tweetId}-{date}-{randomstring}",
    }, {
        name: "Reddit",
        uris: ["reddit.com", "old.reddit.com"],
        context_menu_support: [contextMenuId.saveImage, contextMenuId.saveImageWithCustomPrefix, contextMenuId.addDownloadQueue],
        other_exclusions: ["messages"]
    }, {
        name: "Threads",
        uris: ["threads.net"],
        context_menu_support: [contextMenuId.saveImage, contextMenuId.saveImageWithCustomPrefix, contextMenuId.addDownloadQueue],
        other_exclusions: [],
        placeholder: "{prefix}-{website_title}-{attrib1}-{attrib2}-{date}-{randomstring}",
        attributes: [
            {
                id: 1,
                value: 1
            }, {
                id: 2,
                value: 2
            }
        ]
    }
]

for (let obj of WebsiteSupport){
    Object.defineProperty(obj, "placeholder", {writable: false})
}


function UpdateContextMenus(domain, fUrl){

    if (domain.includes("www")){
        domain = domain.replace(/^www\./g, "");
    }

    const hideContextMenus = (()=>{
        for (let i of Object.values(contextMenuId)){
            chrome.contextMenus.update(i, {
                visible: false
            });
        }
    });
    WS = WebsiteSupport.filter((x)=>{
        return x.uris.includes(domain);
    });

    if (WS.length > 0){
        WS[0].context_menu_support.forEach((cm)=>{
            chrome.contextMenus.update(cm, {
                visible: true
            });
        });

        WS[0].other_exclusions.forEach((OE)=>{
            if (fUrl.includes(OE)){
                hideContextMenus();
            }
        })
    } else {
        hideContextMenus();
    }

}

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
    switch (currentUrl) {
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
            Threads.SaveMedia(data, info.menuItemId);
            break;

        default:
            break;
    }

});

function TestCustomWebsite(domain, data, contextMenuSelectedId){

    console.log(data);

    const splitTool = function(url, number){
        return url.split("/")[number];
    }

    let WW;
    WW = WebsiteSupport.filter((x)=>{
        return x.uris.includes(domain);
    });

    let placeholder;
    console.log(WW)
    placeholder = WW[0].placeholder;
    placeholder = placeholder.split("-");

    let attributeData = WW[0].attributes.map((data)=>{
        return {
            key: data.id,
            value: data.value
        }
    }).reduce((obj, data)=>{
        obj[data.key] = data;
        return obj;
    }, {});

    for (let i=0; i < placeholder.length; i++){
        WW[0].attributes.forEach((x)=>{
            if (placeholder[i] == "{" + x.id + "}"){
                placeholder[i] = splitTool(data.tab_url, x.value);
            }
        });
    }

    console.log("CUSTOM OUTPUT")
    fname = (placeholder).toString().replace(/,/g, "-");
    let testData = []

    switch (contextMenuSelectedId){
        case contextMenuId.saveImage:
            testData.push({
                filename: fname,
                filename_display: "TEST",
                url: data.info_url,
                website: "Squabbles"
             });
             console.log(testData);
             DownloadManager.StartDownload(testData);

           break;

        case contextMenuId.saveImageWithCustomPrefix:

           break;

        case contextMenuId.addDownloadQueue:

           break;
     }

}