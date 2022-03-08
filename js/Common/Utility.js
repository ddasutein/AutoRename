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
 * Access common utility functions
 */

let Utility = {

    /**
     * Generates a random string of letters and numbers
     * 
     * @param {number} length How long the string should be
     */
    GenerateRandomString : ((length) => {
        const value = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const random = [];
        for (let i = 0; i < length; i++) {
            random.push(value[Math.floor(Math.random() * value.length)]);
        }
        return random.join("");
    }),


    /**
     * Splits URL
     * 
     * @param {string} url The name or domain of a website
     * @param {number} index Index number
     */
    SplitURL : ((url, index) => {
        let split = url.split("/"); 
        return split[index];
    }),

    /**
     * Removes unused parameter for the file name builder
     * 
     * @param {array} arr
     * @param {string} keyName
     */
    RemoveUnusedParameter : ((arr, keyName)=>{
        idx = arr.indexOf(keyName);
        if (idx > -1){
            return arr.splice(idx, 1);
        }
    }),

    /**
     * In HTML pages, this can disable or enable fields
     * 
     * @param {string} inputType Type of input
     * @param {string} fieldId The field id of the element you want to hide
     * @param {bool} bool `true` to disable the field and `false` to enable the field
     */
    UpdateFieldDisplay : ((inputType, settingValue, fieldId) => {
        switch (inputType){
            case "checkbox":
                if (settingValue == true){
                    document.getElementById(fieldId).disabled = false;
                } else {
                    document.getElementById(fieldId).disabled = true;

                }
                break;
        }
    })

}