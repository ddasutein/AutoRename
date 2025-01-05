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

import RenderElement from './RenderElement.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("💜 Yakusoku o shiyou Itsudatte bokura hitotsu da yo Let's dream!");

    const ui = document.querySelector(`meta[name="ui"]`).content;
    const jsonFiles = [
        {
            "file": "/ui/settings/x.json",
            "target_div": "tab-twitter"
        },
    ];

    jsonFiles.forEach((x) => {
        fetch(chrome.runtime.getURL(x.file)).then((resp) => {
            return resp.json();
        }).then((res) => {
            let output = RenderElement(res, ui);
            const div = document.getElementById(x.target_div);
            div.appendChild(output);
        }).catch((err) => {
            console.warn("Fetch error >> " + err);
        });
    });
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url) {
            let currentUrl = tabs[0].url;
            currentUrl = currentUrl.split("/");
            let headerTitle = document.getElementById("header-title");
            headerTitle.textContent = currentUrl[2];
        }
    });
});
