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

import { CreateZip } from './IO/CreateZip.js'
import { ClearQueue } from './IO/ClearQueue.js'

export default function HyperlinkManager(ui){

    function OpenModal(){
        const modal = document.querySelector(".modal");
        const closeModalBtn = document.getElementById("closeModalBtn")
        const blurFilter = document.getElementById("blur")
        modal.id = "show";
        blurFilter.classList.toggle("active");

        closeModalBtn.onclick = () => {
            modal.id = 'hide';
            blurFilter.classList.remove("active");
        }
    }

    const LinkType = {
        UriRedirect: "urlredirect",
        ViewModal: "viewmodal"
    }

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
        }, {
            id: "button_feedback",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSdigYwJh5VwE3XE5Yr4nidOvRVqbgCzDPB3PEd1b1DLX30Gsw/viewform?usp=header"
        }, {
            id: "button_privacy_policy",
            url: "https://ddasutein.github.io/autorename-privacy-policy/",
            type: LinkType.ViewModal
        }, {
            id: "button_buy_me_coffee",
            url: "https://buymeacoffee.com/dasutein"
        }, {
            id: "button_help_download_queue",
            url: "https://github.com/ddasutein/AutoRename/wiki/%F0%9F%93%83-How-to-use#download-queue"
        }, {
            id: "button_translation_assist",
            url: "https://github.com/ddasutein/AutoRename/wiki/%F0%9F%8C%8D-Translations#instructions"
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
        if (element != null){
            if (x.type == LinkType.ViewModal){
                element.addEventListener("click", function(a){
                    OpenModal();
                });
            } else {
                console.log("x.id")
                if (element){
                    element.addEventListener("click", function(e){
                        e.preventDefault();
                        doClickAction(x.url);
                    });
                }
            }
        }

    });

    /**
     * We only need to use Mutation Observer in the main options
     */
    if (ui == "main"){
    
        const buttonContainer = document.getElementById("options-quick-actions-button-container");
        const buttonContainerConfig = { attributes: true, childList: true, subtree: true }
        const callback = function(mutationsList, observer){
    
            const elementsObj = LinkLists.reduce((obj, data) => {
                obj[data.id] = data;
                return obj;
            }, {});

    
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {

                    for (let addedNode of mutation.addedNodes){
                        const nodeId = addedNode.id;
                        const hasProp = elementsObj.hasOwnProperty(nodeId);
                        if (hasProp){
                            const elementObjData = elementsObj[nodeId]
                            const element = document.getElementById(nodeId);

                            if (elementObjData.type == LinkType.ViewModal){
                                element.addEventListener("click", function(a){
                                    OpenModal();
                                });
                            } else {
                                element.addEventListener("click", function(e) {
                                    e.preventDefault();
                                    doClickAction(elementObjData.url)
                                });
                            }

                        } else {
    
                            switch (nodeId){
                                case "button_download_all":
                                    CreateZip(nodeId);
                                    break;
                                case "button_clear_queue":
                                    ClearQueue(nodeId);
                                    break;
                                case "button_clear_recent":

                                    const clearRecentButton = document.getElementById(nodeId);
                                    clearRecentButton.addEventListener("click", (()=>{
                                        Settings.Save("global_download_history_data", "[]");
                                        location.reload();
                                    }));
                                    break;
                            }
    
                        }
    
                    }
    
                }
            }
        }
    
        const observer = new MutationObserver(callback);
        observer.observe(buttonContainer, buttonContainerConfig);

    }

}