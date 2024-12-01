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
    }),

    SetBadgeText : ((str)=>{
        if (str == 0 || str == null){
            chrome.action.setBadgeText({
                text: ""
            });
        } else if (str > 0){
            chrome.action.setBadgeText({
                text: str.toString()
            });
        }

    }),

    CreateNewTab : ((url)=>{
        return chrome.tabs.create({
            url: url
        });
    }),

    ValidateParameter: ((params) => (typeof params == "object" && !Array.isArray(params))),

    DateUtils: (() => {
        return {

            GetTimeZone     : (() => Intl.DateTimeFormat().resolvedOptions().timeZone),
            GetLocaleFormat : (() => {
                const browserLanguage = AutoRename.Language;
                return moment().locale(browserLanguage).format("LL");
            }),
            GetUTCOffset    : ((locale = "") => {
                let _locale = locale;
                if (Utility.ValidateParameter(locale)) {
                    _locale = locale.locale || "";
                }

                if (_locale == null) return "";

                if (_locale == "") _locale = Utility.DateUtils().GetLocaleFormat();
                console.log(_locale)
                return moment().tz(_locale).format("Z");
            }),
            SetupDateFormat : ((params, prefer_locale_format = false, date_format = null, utcOffset = null) => {
                let dateStr = params;
                const specialCharacters = new RegExp(/[:/]/g)

                if (Utility.ValidateParameter(params)){
                    dateStr = params.inputDate || "";
                    prefer_locale_format = params.preferLocaleFormat || prefer_locale_format;
                    date_format = params.dateFormat || null;
                    utcOffset = params.utcOffset || null;
                }

                if (date_format == null && prefer_locale_format == false) throw Error("Date Format not specified");
                if (utcOffset != null) utcOffset = Utility.DateUtils().GetUTCOffset(utcOffset);
                if (utcOffset == null) utcOffset = Utility.DateUtils().GetUTCOffset();
                console.log(">> UTC OFFSET " + utcOffset)

                if (prefer_locale_format){
                    dateStr = Utility.DateUtils().GetLocaleFormat()
                } else {
                    dateStr = moment().utcOffset(utcOffset).format(date_format);
                    if (dateStr.match(specialCharacters)){
                        dateStr = dateStr.replace(specialCharacters, "_");
                    }
                }

                return dateStr;
            })

        }
    })
    
    

}