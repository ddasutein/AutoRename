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

export default function HyperlinkManager(){
    
    /**
     * This is the master list for all hyperlinks that can be re-used across HTML pages. 
     * 
     * `ID`   = Refers to the ID of the element
     * `URL`  = Set the URL where you want to redirect the user to
     */
    const LinkLists = [
        {
            id: "nav-github",
            url: "https://github.com/ddasutein/AutoRename"
        }, {
            id: "nav-help",
            url: "https://github.com/ddasutein/AutoRename/wiki"
        }, {
            id: "nav-settings",
            url: "options"
        }, {
            id: "button_help_general",
            url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#general"
        }, {
            id: "button_help_twitter",
            url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#x-formerly-twitter"
        }, {
            id: "button_help_reddit",
            url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#reddit"
        }, {
            id: "button_help_threads",
            url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#threads"
        }, {
            id: "button_help_bluesky",
            url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#bluesky"
        }
    ];

    function doClickAction(action){
        switch (action){
            case "options":
                chrome.runtime.openOptionsPage();
                break;
            default:
                chrome.tabs.create({
                    url: action
                });
                break;
        }
    }

    LinkLists.forEach((x) => {
        const element = document.getElementById(x.id);
        if (element){
            element.addEventListener("click", function(e){
                e.preventDefault();
                doClickAction(x.url);
            });
        }
    })

}