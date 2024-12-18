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

const AutoRename = {
    Name: chrome.runtime.getManifest().name,
    CurrentTabName: null,
    CurrentTabId: 0,
    GetUserAgent: `${navigator.userAgent} ${chrome.runtime.getManifest().name}/${chrome.runtime.getManifest().version}`,
    Icon: chrome.runtime.getURL("assets/autorename-128px.png"),
    Language: chrome.i18n.getUILanguage(),
    LogLevel: {
        "DEBUG": "debug",
        "VERBOSE": "verbose",
        "ERROR": "error",
        "INFO": "info",
        "WARN": "warn",
        "NONE": "none"
    },
    SetLogLevel: "debug",
    EnableLogging: false,
    Version: chrome.runtime.getManifest().version
}

Object.keys(AutoRename).forEach(key => {
    // Do not lock these keys
    if (!["EnableLogging", "LOG_LEVEL", "CurrentTabId", "CurrentTabName"].includes(key)) {
        Object.defineProperty(AutoRename, key, {
            writable: false,
            configurable: false
        });
    }
});

function WriteLog(logType = "debug", details = ""){

    const LogLevel = AutoRename.LogLevel;
    const IsLoggingEnabled = AutoRename.EnableLogging;
    let _type = logType;
    let _message = details;
    
    if (typeof logType == "object" && !Array.isArray(logType) ){
        _type       = logType.log_level || AutoRename.LogLevel.DEBUG;
        _message    = logType.details   || details;
    }

    if (!IsLoggingEnabled) return;

    switch (_type){
        case LogLevel.DEBUG:
            console.log(_message)
            break;
        case LogLevel.INFO:
            console.info(_message);
            break;
        case LogLevel.ERROR:
            console.error(_message);
            break;
        case LogLevel.WARN:
            console.warn(_message);
            break;
        case LogLevel.VERBOSE:
            console.log(_message);
            break;
    }

}


(() => {
    console.log("🎵 It's like each of our wishes shines through, it's the sea! We'll meet again here, we'll surely see each other again")

    const Backgroundscripts = [
        "/js/Settings.js",
        "/js/Runtime.js",
        "/lib/Moment/moment.js",
        "/lib/Moment/moment-with-locales.js",
        "/lib/Moment/moment-timezone-with-data.js",
        "/js/Common/Utility.js",
        "/js/Twitter/TwitterContent.js",
        "/js/Bluesky/Bluesky.js",
        "/js/Reddit/RedditContent.js",
        "/js/Threads/ThreadsContent.js",
        "/js/DownloadManager.js",
        "/js/SaveAsEventHandle.js"
    ]
    
    try {
        Backgroundscripts.forEach((x)=>{
            importScripts(x);
        });
    
    }catch(e){
        console.error(e);
    }
})();