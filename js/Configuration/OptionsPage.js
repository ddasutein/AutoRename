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
 * Reusable dialog boxes for swal library
 */
const messageBox = {

    autoCloseTimer: 1500,

    Save: (() => {

        return swal ({
            title: "",
            text: chrome.i18n.getMessage("context_save_success"),
            icon: "success",
            buttons: false,
            dangerMode: false,
            timer: messageBox.autoCloseTimer
        });
    }),

    Warning : ((title, message)=>{
        return swal({
            title: title,
            text: message,
            icon: "warning",
            buttons: false,
            dangerMode: false
        });
    })
}

const specialCharacters = new RegExp(/[?!@#$%^&*(),';\:*"<>|/]/g);


/**
 * Validates the customized date/time format in the text field before processing it
 * to Moment JS. This is also checks for special characters that are not permitted by
 * the operating system
 * 
 * @param {*} settingsKey The corresponding key in settings
 * @param {*} dateString  Date string
 * @returns 
 */
function ValidateDateTimeFormat(settingsKey, dateString){

    let output = {};

    if (dateString == "" || dateString == null || dateString == undefined){
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
        output["is_error"] = true;
    } else {

        // Check for special characters that are not allowed by the operating system
        if (dateString.match(specialCharacters)){
            isValidDateFormat = false;

            output["title"] = chrome.i18n.getMessage("error_title_invalid");
            output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
            output["is_error"] = true;

        } else {
            output["is_error"] = false;
        }

    } 

    if (output.is_error){
        return output;
    } else {
        Settings.Save(settingsKey, dateString);
        return output;
    }
}

/**
 * Checks prefix for illegal or disallowed characters by the operating system
 * 
 * @param {*} settingsKey The corresponding key in settings
 * @param {*} prefixString 
 * @returns 
 */
function ValidatePrefix(settingsKey, prefixString){

    let output = {};
    if (prefixString.match(specialCharacters)){
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_prefix");
        output["is_error"] = true;
    } else {
        output["is_error"] = false;
    }

    if (output.is_error){
        return output;
    } else {
        Settings.Save(settingsKey, prefixString);
        return output;
    }
}



document.onreadystatechange = () => {

    if (document.readyState == "interactive" || document.readyState == "complete") {
        const generalPref = Settings.Load().General;

        generalPref.forEach(function (x) {
            switch (x.key) {
                case "global_show_download_folder":
                    document.getElementById("general_settings_auto_show_download_folder").checked = x.value
                    break;
                case "global_enable_save_as_window":
                    document.getElementById("general_settings_enable_save_as_window").checked = x.value
                    break;
                case "global_notifications_updated":
                    document.getElementById("general_settings_notification_updated").checked = x.value
                    break;
            }
        });

        const twitterPref = Settings.Load().Twitter;

        twitterPref.map(function (x) {
            switch (x.key) {
                case "twitter_include_mention_symbol":
                    document.getElementById("twitter_settings_include_mention_symbol").checked = x.value;
                    break;
                case "twitter_include_tweet_id":
                    document.getElementById("twitter_settings_include_tweet_id").checked = x.value;
                    break;
                case "twitter_include_date":
                    document.getElementById("twitter_settings_include_date_checkbox").checked = x.value;
                    break;
                case "twitter_date_format":
                    document.getElementById("twitter_settings_select_date_format").value = x.value;
                    break;
                case "twitter_random_string_length":
                    document.getElementById("twitter_settings_string_length").value = x.value;
                    break;
                case "twitter_include_website_title":
                    document.getElementById("twitter_settings_site_title").checked = x.value;
                    break;
                case "twitter_settings_custom_date_format":
                    document.getElementById("twitter_settings_custom_date_format").value = x.value;
                    break;
                case "twitter_settings_custom_prefix":
                    document.getElementById("twitter_settings_custom_prefix").value = x.value;
                    break;
            }
        });

        const lineblogPref = Settings.Load().LINE_BLOG;

        lineblogPref.map(function (x) {
            switch (x.key) {
                case "lbPrefIncludeWebsiteTitle":
                    document.getElementById("lineblog_settings_include_site_title").checked = x.value;
                    break;
                case "lbPrefIncludeBlogTitle":
                    document.getElementById("lineblog_include_blog_title").checked = x.value;
                    break;
                case "lbPrefUseDate":
                    document.getElementById("lineblog_settings_include_date").checked = x.value;
                    break;
                case "lbPrefDateFormat":
                    document.getElementById("lineblog_settings_select_date_format").value = x.value;
                    break;
                case "lbPrefStringGenerator":
                    document.getElementById("lineblog_settings_string_length").value = x.value;
                    break;
                case "lineblog_convert_title_romaji":
                    document.getElementById("lineblog_settings_convert_title_romaji").checked = x.value;
                    break;
                case "lineblogPreferLocaleFormat":
                    document.getElementById("lineblog_settings_prefer_locale_format").checked = x.value;
                    break;
                case "lineblogCustomDateFormat":
                    document.getElementById("lineblog_settings_custom_date_format").value = x.value;
                    break;
                case "lineblogCustomPrefix":
                    document.getElementById("lineblog_settings_custom_prefix").value = x.value;
                    break;
            }
        });

        const redditPref = Settings.Load().Reddit;

        redditPref.map((x) => {
            switch (x.key) {

                case "redditIncludeWebsite":
                    document.getElementById("reddit_settings_site_title").checked = x.value;
                    break;

                case "redditIncludePostID":
                    document.getElementById("reddit_settings_subreddit_post_id").checked = x.value;
                    break;

                case "redditIncludeDate":
                    document.getElementById("reddit_settings_include_date").checked = x.value;
                    break;

                case "redditStringGenerator":
                    document.getElementById("reddit_settings_string_length").value = x.value;
                    break;

                case "redditDateFormat":
                    document.getElementById("reddit_settings_select_date_format").value = x.value;
                    break;

                case "redditPreferLocaleFormat":
                    document.getElementById("reddit_settings_prefer_locale_format").checked = x.value;
                    break;

                case "redditCustomDateFormat":
                    document.getElementById("reddit_settings_custom_date_format").value = x.value;
                    break;

                case "redditCustomPrefix":
                    document.getElementById("reddit_settings_custom_prefix").value = x.value;
                    break;


            }
        });       

    }
}

/**
 * Perform execution after page has loaded
 * 
 */
document.addEventListener("DOMContentLoaded", (()=>{

    //#region Tab Switching Logic
    const tabs = document.querySelectorAll("[data-tab-target]");
    const tabContents = document.querySelectorAll("[data-tab-content]");
    tabs.forEach((tab) => {

    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => tabContent.classList.remove("active"));
        tabs.forEach(tabContent => tabContent.classList.remove("active"));
        tab.classList.add("active");
        target.classList.add("active");

        });
    });
    //#endregion

    let temp = [];
    let errorCode = {};

    /**
     * RULES FOR SAVING CONFIGURATION
     * 
     * 1. Add them in try-block. You need to perform text field validation
     * 2. Any validation error in #1 should not save all configuration until condition is met
     * 3. Remember to reset the temp and errorCode variables on every button click
     * 4. Text field validation should take priority over checkbox or select controls
     * 
     */
    document.querySelectorAll("button").forEach((buttons) => {

        switch (buttons.id) {
    
            case "button_help_twitter":
                buttons.addEventListener("click", (()=>{
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"
                    })
                }));
                break;
    
            case "button_help_lineblog":
                buttons.addEventListener("click", (()=>{
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#line-blog"
                    })
                }));
                break;
    
            case "button_help_reddit":
                buttons.addEventListener("click", (()=>{
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#reddit"
                    })
                }));
                break;
    
            case "button_save_general":
                buttons.addEventListener("click", (() => {
                    Settings.Save("global_show_download_folder", document.getElementById("general_settings_auto_show_download_folder").checked);
                    Settings.Save("global_enable_save_as_window", document.getElementById("general_settings_enable_save_as_window").checked);
                    Settings.Save("global_notifications_updated", document.getElementById("general_settings_notification_updated").checked);
                    messageBox.Save();
                }));
    
                break;
    
            case "button_save_twitter":
    
                buttons.addEventListener("click", (() => {

                    try {
                        
                        if (temp.length > 0){
                            temp = [];
                            errorCode = {};
                        }

                        temp.push(ValidateDateTimeFormat("twitter_settings_custom_date_format", document.getElementById("twitter_settings_custom_date_format").value));
                        temp.push(ValidatePrefix("twitter_settings_custom_prefix", document.getElementById("twitter_settings_custom_prefix").value));
                        temp.forEach((x)=>{
                            if (x.is_error == true){
                                errorCode["title"] = x.title;
                                errorCode["message"] = x.message;
                                throw errorCode;

                            } 
                        });
                        
                        Settings.Save("twitter_include_mention_symbol", document.getElementById("twitter_settings_include_mention_symbol").checked);
                        Settings.Save("twitter_include_tweet_id", document.getElementById("twitter_settings_include_tweet_id").checked);
                        Settings.Save("twitter_include_date", document.getElementById("twitter_settings_include_date_checkbox").checked);
                        Settings.Save("twitter_date_format", document.getElementById("twitter_settings_select_date_format").value);
                        Settings.Save("twitter_random_string_length", document.getElementById("twitter_settings_string_length").value);
                        Settings.Save("twitter_include_website_title", document.getElementById("twitter_settings_site_title").checked);
                        Settings.Save("twitter_prefer_locale_format", document.getElementById("twitter_settings_prefer_locale_format").checked);
                        messageBox.Save();
        
                    } catch(e){
                        console.error(e);
                        messageBox.Warning(e.title, e.message);
                    }
       
                }));
    
                break;
    
            case "button_save_lineblog":
                buttons.addEventListener("click", (() => {
                    
                    try {

                        if (temp.length > 0){
                            temp = [];
                            errorCode = {};
                        }

                        temp.push(ValidateDateTimeFormat("lineblogCustomDateFormat", document.getElementById("lineblog_settings_custom_date_format").value));
                        temp.push(ValidatePrefix("lineblogCustomPrefix", document.getElementById("lineblog_settings_custom_prefix").value));
                        temp.forEach((x)=>{
                            if (x.is_error == true){
                                errorCode["title"] = x.title;
                                errorCode["message"] = x.message;
                                throw errorCode;

                            } 
                        });
         
                        Settings.Save("lbPrefIncludeWebsiteTitle", document.getElementById("lineblog_settings_include_site_title").checked);
                        Settings.Save("lbPrefIncludeBlogTitle", document.getElementById("lineblog_include_blog_title").checked);
                        Settings.Save("lbPrefUseDate", document.getElementById("lineblog_settings_include_date").checked);
                        Settings.Save("lbPrefStringGenerator", document.getElementById("lineblog_settings_string_length").value);
                        Settings.Save("lineblog_convert_title_romaji", document.getElementById("lineblog_settings_convert_title_romaji").checked);
                        Settings.Save("lineblogDateFormat", document.getElementById("lineblog_settings_select_date_format").value);
                        Settings.Save("lineblogCustomPrefix", document.getElementById("lineblog_settings_custom_prefix").value);
    
                        messageBox.Save();
                        
                    } catch(e){
                        console.error(e)
                        messageBox.Warning(e.title, e.message);
                    }

    
                }));
    
                break;
    
            case "button_save_reddit":
                buttons.addEventListener("click", (() => {

                    try {

                        if (temp.length > 0){
                            temp = [];
                            errorCode = {};
                        }

                        temp.push(ValidateDateTimeFormat("redditCustomDateFormat", document.getElementById("reddit_settings_custom_date_format").value));
                        temp.push(ValidatePrefix("redditCustomPrefix", document.getElementById("reddit_settings_custom_prefix").value));

                        temp.forEach((x)=>{
                            if (x.is_error == true){
                                errorCode["title"] = x.title;
                                errorCode["message"] = x.message;
                                throw errorCode;

                            } 
                        });
         

                        Settings.Save("redditIncludeWebsite", document.getElementById("reddit_settings_site_title").checked);
                        Settings.Save("redditIncludePostID", document.getElementById("reddit_settings_subreddit_post_id").checked);
                        Settings.Save("redditIncludeDate", document.getElementById("reddit_settings_include_date").checked);
                        Settings.Save("redditDateFormat", document.getElementById("reddit_settings_select_date_format").value);
                        Settings.Save("redditStringGenerator", document.getElementById("reddit_settings_string_length").value);
                        Settings.Save("redditPreferLocaleFormat", document.getElementById("reddit_settings_prefer_locale_format").checked)

                        messageBox.Save();
                    } catch(e){
                        console.error(e);
                        messageBox.Warning(e.title, e.message);
                    }

                }));
    
                break;
    
            case "button_help_general":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#general"
                    });
                }));
                break;
    
            case "button_help_twitter":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"
                    });
                }));
                break;
    
            case "button_help_lineblog":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#line-blog"
                    });
                }));
                break;
    
            case "button_help_reddit":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#reddit"
                    });
                }));
                break;
    
    
        }
    });
}));