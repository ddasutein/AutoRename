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

import { RenderElement, ShowNotAvailable } from './RenderElement.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("💜 Yakusoku o shiyou Itsudatte bokura hitotsu da yo Let's dream!");

    const ui = document.querySelector(`meta[name="ui"]`).content;
    const jsonFiles = [
        {
            "file": "/ui/settings/x.json",
            "domain": ["x.com", "pro.x.com", "twitter.com"]
        },
    ];


    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url) {

            function setupPopupArea(html){
                console.log(html);
                const contentDiv = document.getElementById("popup-area");
                contentDiv.appendChild(html);
            }

            let currentUrl = tabs[0].url;
            currentUrl = currentUrl.split("/");
            let headerTitle = document.getElementById("header-title");
            currentUrl = currentUrl[2];
            headerTitle.textContent = currentUrl;

            const isWebsiteAvailable = jsonFiles.some((e) => {
                return (e.domain).some((a) => {
                    return a == currentUrl;
                });
            });

            let html = "";
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

    const navMoreSettings = document.getElementById("nav-more-settings");
    navMoreSettings.addEventListener("click", function(){
        chrome.runtime.openOptionsPage();
    });
    
});
