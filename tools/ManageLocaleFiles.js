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
 * *******************************************
 * 
 * This is a tool to automatically copy the localization keys to other localization files.
 * 
 * To use this tool, use VS Code and download the Quokka extension. Once installed, simply run the current file.
 * I would also recommend installing the beautify extension for the next step.
 * 
 * in localeOutput.json, use Beautify extension then copy this to the corresponding localization file
 * 
 */

const fs = require('fs');
const path = require('path');

const BASE_LOCALIZATION = path.resolve('_locales', 'en', 'messages.json');
const TARGET_LOCALIZATION = path.resolve('_locales', 'ja', 'messages.json');

let BASE_JSON = {};
let TARGET_JSON = {};

const OUTPUT_TO_CONSOLE = false;

fs.readFile(BASE_LOCALIZATION, 'utf8', (err, data) => {
    if (err) {
        console.error("File error 1", err)
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        BASE_JSON = jsonData;

        OUTPUT_TO_CONSOLE == true ? console.log(BASE_JSON) : "";

        fs.readFile(TARGET_LOCALIZATION, 'utf8', (err, data) => {
            if (err) {
                console.error("File error 2", err)
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                TARGET_JSON = jsonData;
                OUTPUT_TO_CONSOLE == true ? console.log(TARGET_JSON) : "";

                /**
                 * Here it will output the final JSON which you can use to edit
                 */

                FINAL_OUTPUT = CopyAllKeys(BASE_JSON, TARGET_JSON);
                const filePath = path.join(__dirname, 'localeOutput.json');
                fs.writeFile(filePath, JSON.stringify(FINAL_OUTPUT), (err) => {
                    if (err) {
                        console.log("Write Error", err)
                        return;
                    }
                    console.log("Saved")
                })

                // Do something with the JSON data
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
            }
        });


    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    }
});


function CopyAllKeys(source, target) {
    Object.keys(source).forEach(key => {
        if (typeof source[key] == "object" && source[key] !== null && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            CopyAllKeys(source[key], target[key]);
        } else {
           if (key == "message"){
            target[key] = target.hasOwnProperty(key) ? target[key] : "";
           } else {
            target[key] = source[key];
           }
        }
    });
    return target;
}