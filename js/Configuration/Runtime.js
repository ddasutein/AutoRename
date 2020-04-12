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

/**
 * 
 */

let getExtensionVersion = chrome.runtime.getManifest().version;

function ShowUpdateMsg(){
    chrome.notifications.create(
        "noti_1", {
            "buttons": [{
                    title: "Change log"
                },
                {
                    title: "OK",
                }
            ],
            "iconUrl": chrome.extension.getURL("assets/AutoRename-Logo-48px.png"),
            "type": "basic",
            "title": "AutoRename",
            "message": chrome.i18n.getMessage("runtime_extension_updated") + " " + getExtensionVersion
        }
    );
}

function ShowWelcomeMsg(){
    chrome.notifications.create(
        "noti_2", {
            "iconUrl": chrome.extension.getURL("assets/AutoRename-Logo-48px.png"),
            "type": "basic",
            "title": "AutoRename",
            "message": "Welcome to AutoRename"
        }
    );   
}

chrome.notifications.onButtonClicked.addListener(function (notifId, index) {

    switch (notifId){
        case "noti_1":
            if (index == 0){
                window.open("https://github.com/ddasutein/AutoRename/releases", "_blank");
            }
            break;
        case "noti_2":
            if (index == 0){
                window.open("https://github.com/ddasutein/AutoRename/wiki", "_blank");
            }
            break;
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log(details.reason);
    switch (details.reason){
        case "install":
            //ShowWelcomeMsg();
            break;
        case "update":
            ShowUpdateMsg();
            break;
    }
});