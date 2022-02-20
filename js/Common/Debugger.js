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

console.log("Welcome to AutoRename" + "\n" +
    "GitHub: " + "https://github.com/ddasutein/AutoRename" + "\n" +
    "Enable Console Debugging by setting 'DevMode' to TRUE");

// Enable developer logging mode. This must be set to FALSE when releasing to users
let DevMode = true;

let Debug = {

    GetExtensionVersion: function(){
        return console.log(getExtensionVersion);
    },

    GetPlatformInfo: function () {
        chrome.runtime.getPlatformInfo(function (info) {
            return console.log(info);
        });
    },

    Settings: function (command) {

        switch (command) {
            case "all":
                return console.table(Settings.Load().All);

            case "general":
                return console.table(Settings.Load().General);

            case "twitter":
                return console.table(GetSettings.Load().Twitter);

            case "lineblog":
                return console.table(GetSettings.Load().LINE_BLOG);

            case "reddit":
                return console.table(GetSettings.Load().Reddit);
        }

    },
}

/**
 * Output to Browser Console
 * 
 * @param {string} string 
 */
function WriteToConsole(string){
    if (!DevMode){
        console.log("<DEV MODE NOT ENABLED>");
    } else {
        console.log(string);
    }
}