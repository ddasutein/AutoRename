/** MIT License
 * 
 * Copyright (c) 2025 Dasutein
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

import { 
    RenderElement, 
    ShowNotAvailable, 
    SetLegacyLocale, 
    SetExtensionInfo } from './RenderElement.js';
import HyperlinkManager from './HyperlinkManager.js';
import LoadSettings from './ui/LoadSettings.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("💜 Yakusoku o shiyou Itsudatte bokura hitotsu da yo Let's dream!");

    const ui = document.querySelector(`meta[name="ui"]`).content;
    const jsonFiles = [
        {
            "file": "/ui/settings/x.json",
            "target_div_in_main": "twitter-settings-file-parameter-area",
            "domain": ["x.com", "pro.x.com", "twitter.com"]
        }, {
            "file": "/ui/settings/bluesky.json",
            "target_div_in_main": "bluesky-settings-file-parameter-area",
            "domain": ["bsky.app"]
        }, {
            "file": "/ui/settings/reddit.json",
            "target_div_in_main": "reddit-settings-file-parameter-area",
            "domain": ["reddit.com", "old.reddit.com"]
        }, {
            "file": "/ui/settings/threads.json",
            "target_div_in_main": "threads-settings-file-parameter-area",
            "domain": ["threads.net"]
        }
    ];
    LoadSettings();
    HyperlinkManager(ui);
    SetExtensionInfo();
    SetLegacyLocale();

    switch (ui){
        case "main":
            jsonFiles.forEach((x) => {
                fetch(chrome.runtime.getURL(x.file)).then((resp) => {
                    return resp.json();
                }).then((res) => {
                    let output = RenderElement(res, ui);
                    const div = document.getElementById(x.target_div_in_main);
                    div.appendChild(output);
                }).catch((err) => {
                    console.warn("Fetch error >> " + err);
                });
            });
            break
        
        case "popup":

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url) {
        
                    function setupPopupArea(html){
                        console.log(html);
                        const contentDiv = document.getElementById("popup-area");
                        contentDiv.appendChild(html);
                    }
        
                    let currentUrl = tabs[0].url;
                    currentUrl = currentUrl.split("/");
                    let currentUrlScheme = currentUrl[0];
                    console.log(currentUrl)
                    let headerTitle = document.getElementById("header-title");
                    currentUrl = currentUrl[2].replace(/www./g, "");
                    headerTitle.textContent = currentUrlScheme == "chrome-extension:" ? "" : currentUrl;
        
                    const isWebsiteAvailable = jsonFiles.some((e) => {
                        return (e.domain).some((a) => {
                            return a == currentUrl;
                        });
                    });
        
                    if (isWebsiteAvailable){
                        const getJSON = jsonFiles.filter((x)=>{
                            return (x.domain).some((e => e == currentUrl));
                        })[0].file;
        
                        fetch(chrome.runtime.getURL(getJSON)).then((resp) => {
                            return resp.json();
                        }).then((res) => {
                            let output = RenderElement(res, ui);
                            setupPopupArea(output);
                        }).catch((err) => {
                            console.warn("Fetch error >> " + err);
                            setupPopupArea( ShowNotAvailable() );
                        });
                        
                    } else {
                        setupPopupArea( ShowNotAvailable() );
                    }
        
                }
            });

            break;
    }

    
});
