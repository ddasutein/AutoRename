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

/**
 * Get the extension version
 */

let getExtensionVersion = chrome.runtime.getManifest().version;

let getExtensionName = chrome.runtime.getManifest().name;

function ShowUpdateMsg(){
    chrome.notifications.create(
        "noti_1", {
            "buttons": [{
                    title: chrome.i18n.getMessage("message_toast_button_whats_new")
                },
                {
                    title: chrome.i18n.getMessage("message_toast_button_ok"),
                }
            ],
            "iconUrl": chrome.extension.getURL("assets/autorename-128px.png"),
            "type": "basic",
            "title": getExtensionName,
            "message": chrome.i18n.getMessage("message_toast_new_version") + " " + getExtensionVersion
        }
    );
}

function ShowWelcomeMsg(){
    chrome.notifications.create(
        "noti_2", {
            "buttons": [{
                title: chrome.i18n.getMessage("message_toast_button_github_wiki")
            }, {
                title: chrome.i18n.getMessage("message_toast_button_ok")
            }],
            "iconUrl": chrome.extension.getURL("assets/autorename-128px.png"),
            "type": "basic",
            "title": `${chrome.i18n.getMessage("message_toast_welcome_title")} ${getExtensionName}`,
            "message": `${chrome.i18n.getMessage("message_toast_welcome_body")}`
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

    let runtimeSettings = Settings.Load().General;

    switch (details.reason){
        case "install":
            ShowWelcomeMsg();
            break;
        case "update":

            runtimeSettings.map((key, index) => {
                switch (index){
                    case 2:
                        if (key.value){
                            ShowUpdateMsg();
                        }
                }
            });

            break;
    }
});