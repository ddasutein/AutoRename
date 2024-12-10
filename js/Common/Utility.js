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
            GetUserFormat   : (() => {

                let userDateFormat = "";

                DateSettings = Settings.Load().General;
                DateSettings = DateSettings.filter((x)=>{
                    const dateKeys = [
                        "global_custom_date_format", 
                        "global_date_format", 
                        "global_prefer_locale_format"
                    ]
                    return dateKeys.some((e => e == x.key));
                }).reduce((obj, data) => {
                    obj[data.key] = data;
                    return obj;
                }, {});

                if (DateSettings["global_date_format"].value == "custom"){
                    userDateFormat = DateSettings["global_custom_date_format"].value;
                } else {

                    switch (+DateSettings["global_date_format"].value){
                        case 0:
                            userDateFormat = "MM-DD-YYYY";
                            break;
                        case 1:
                            userDateFormat = "DD-MM-YYYY";
                            break;
                        case 2:
                            userDateFormat = "YYYY-MM-DD";
                            break;
                            // 3-5 = Long Format
                        case 3:
                            userDateFormat = "MMMM DD, YYYY";
                            break;
                        case 4:
                            userDateFormat = "DD MMMM YYYY";
                            break;
                        case 5:
                            userDateFormat = "YYYY MMMM DD";
                            break;
                            // 6-8 = Short Format
                        case 6:
                            userDateFormat = "MMM DD, YYYY";
                            break;
                        case 7:
                            userDateFormat = "DD MMM YYYY";
                            break;
                        case 8:
                            userDateFormat = "YYYY MMM DD";
                            break;
                    }
                }
                
                if (DateSettings["global_prefer_locale_format"].value == true){
                    userDateFormat = "LLL";
                    console.log(userDateFormat);
                }

                return userDateFormat;
            }),
            GetCurrentTime  : (() => new Date()),
            GetTimeZone     : (() => Intl.DateTimeFormat().resolvedOptions().timeZone),
            GetLocaleFormat : (() => {
                return moment().locale(AutoRename.Language).format("LLL");
            }),
            GetUTCOffset    : ((locale = "") => {
                let _locale = locale;
                if (Utility.ValidateParameter(locale)) {
                    _locale = locale.locale || "";
                }

                if (_locale == null) return "";

                if (_locale == "") _locale = Utility.DateUtils().GetLocaleFormat();

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

                if (prefer_locale_format){
                    dateStr = Utility.DateUtils().GetLocaleFormat();
                } else {

                    if (utcOffset != null || utcOffset != undefined){
                        dateStr = moment(dateStr).utcOffset(utcOffset).format(date_format);
                    } else {
                        dateStr = moment(dateStr).format(date_format);
                    }
                }
                
                dateStr = dateStr.replace(specialCharacters, "_");
                return dateStr;
            })

        }
    })
    
    

}