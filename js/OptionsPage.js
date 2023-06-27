/** MIT License
 * 
 * Copyright (c) 2023 Dasutein
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

        return swal({
            title: "",
            text: chrome.i18n.getMessage("context_save_success"),
            icon: "success",
            buttons: false,
            dangerMode: false,
            timer: messageBox.autoCloseTimer
        });
    }),

    Warning: ((title, message) => {
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
function ValidateDateTimeFormat(settingsKey, dateString) {

    let output = {};

    if (dateString == "" || dateString == null || dateString == undefined) {
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
        output["is_error"] = true;
    } else {

        // Check for special characters that are not allowed by the operating system
        if (dateString.match(specialCharacters)) {
            isValidDateFormat = false;

            output["title"] = chrome.i18n.getMessage("error_title_invalid");
            output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
            output["is_error"] = true;

        } else {
            output["is_error"] = false;
        }

    }

    if (output.is_error) {
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
function ValidatePrefix(settingsKey, prefixString) {

    let output = {};
    if (prefixString.match(specialCharacters)) {
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_prefix");
        output["is_error"] = true;
    } else {
        output["is_error"] = false;
    }

    if (output.is_error) {
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
                case "global_use_autorename_folder":
                    document.getElementById("general_settings_use_autorename_folder").checked = x.value;     
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
                    Utility.UpdateFieldDisplay("checkbox", x.value, "twitter_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "twitter_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "twitter_settings_custom_date_format");

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

                case "twitter_prefer_locale_format":
                    document.getElementById("twitter_settings_prefer_locale_format").checked = x.value;
                    break;
                case "twitter_settings_custom_date_format":
                    document.getElementById("twitter_settings_custom_date_format").value = x.value;
                    break;
                case "twitter_settings_custom_prefix":
                    document.getElementById("twitter_settings_custom_prefix").value = x.value;
                    break;

                case "twitter_save_image_to_folder_based_on_username":
                    document.getElementById("twitter_settings_save_to_folder_by_username").checked = x.value;
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
                    Utility.UpdateFieldDisplay("checkbox", x.value, "lineblog_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "lineblog_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "lineblog_settings_custom_date_format");
                    break;
                case "lineblogDateFormat":
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
                    Utility.UpdateFieldDisplay("checkbox", x.value, "reddit_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "reddit_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", x.value, "reddit_settings_custom_date_format");
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
document.addEventListener("DOMContentLoaded", (() => {

    //#region Tab Switching Logic
    const tabs = document.querySelectorAll("[data-tab-target]");
    const tabContents = document.querySelectorAll("[data-tab-content]");

    const optionsConfig = Settings.Load().OptionsUI.map((data)=>{
        return {
            "key": data.key,
            "value": data.value
        }
    }).reduce((obj, data)=>{
        obj[data.key] = data;
        return obj;
    }, {});
    
    createDownloadCardItem();

    tabs.forEach((tab, idx) => {

        if (idx == optionsConfig["optionsUITabIndexNumber"].value){
            const target = document.querySelector(optionsConfig["optionsUITabName"].value);
            tabContents.forEach(tabContent => tabContent.classList.remove("active"));
            tabs.forEach(tabContent => tabContent.classList.remove("active"));
            tab.classList.add("active");
            target.classList.add("active");

        }

        tab.addEventListener("click", () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tabContent => tabContent.classList.remove("active"));
            tabs.forEach(tabContent => tabContent.classList.remove("active"));
            tab.classList.add("active");
            target.classList.add("active");

            Settings.Save("optionsUITabName", tab.dataset.tabTarget);
            Settings.Save("optionsUITabIndexNumber", idx);

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

        /**
         * DEV NOTE #1
         * -----------------
         * It might seem odd but the logic behind this is that the date validation should
         * only apply when "Custom" is selected. When a user types random values in the
         * text field, validation does not apply. However, when custom is selected then the
         * validation applies. No matter what, the user can't use illegal characters in the 
         * date format
         * 
         */

        switch (buttons.id) {

            // case "download-primary":
            //     buttons.addEventListener("click", (() => {
            //         alert("TEST " + buttons.id)
            //     }));
            //     break;

            case "button_help_twitter":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"
                    })
                }));
                break;

            case "button_help_lineblog":
                buttons.addEventListener("click", (() => {
                    chrome.tabs.create({
                        url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#line-blog"
                    })
                }));
                break;

            case "button_help_reddit":
                buttons.addEventListener("click", (() => {
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
                    Settings.Save("global_use_autorename_folder", document.getElementById("general_settings_use_autorename_folder").checked)
                    messageBox.Save();
                }));

                break;

            case "button_save_twitter":

                buttons.addEventListener("click", (() => {

                    try {

                        if (temp.length > 0) {
                            temp = [];
                            errorCode = {};
                        }
                        if (document.getElementById("twitter_settings_include_date_checkbox").checked && !document.getElementById("twitter_settings_prefer_locale_format").checked && document.getElementById("twitter_settings_select_date_format").value == "custom") {
                            temp.push(ValidateDateTimeFormat("twitter_settings_custom_date_format", document.getElementById("twitter_settings_custom_date_format").value));
                        }

                        temp.push(ValidatePrefix("twitter_settings_custom_prefix", document.getElementById("twitter_settings_custom_prefix").value));
                        temp.forEach((x) => {
                            if (x.is_error == true) {
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
                        Settings.Save("twitter_save_image_to_folder_based_on_username", document.getElementById("twitter_settings_save_to_folder_by_username").checked);

                        // See dev note #1
                        Settings.Save("twitter_settings_custom_date_format", document.getElementById("twitter_settings_custom_date_format").value);


                        messageBox.Save();

                    } catch (e) {
                        console.error(e);
                        messageBox.Warning(e.title, e.message);
                    }

                }));

                break;

            case "button_save_lineblog":
                buttons.addEventListener("click", (() => {

                    try {

                        if (temp.length > 0) {
                            temp = [];
                            errorCode = {};
                        }

                        if (document.getElementById("lineblog_settings_include_date").checked && !document.getElementById("lineblog_settings_prefer_locale_format").checked && document.getElementById("lineblog_settings_select_date_format").value == "custom") {
                            temp.push(ValidateDateTimeFormat("lineblogCustomDateFormat", document.getElementById("lineblog_settings_custom_date_format").value));
                        }

                        temp.push(ValidatePrefix("lineblogCustomPrefix", document.getElementById("lineblog_settings_custom_prefix").value));
                        temp.forEach((x) => {
                            if (x.is_error == true) {
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

                        // See dev note #1
                        Settings.Save("lineblogCustomDateFormat", document.getElementById("lineblog_settings_custom_date_format").value);
                        messageBox.Save();

                    } catch (e) {
                        console.error(e)
                        messageBox.Warning(e.title, e.message);
                    }


                }));

                break;

            case "button_save_reddit":
                buttons.addEventListener("click", (() => {

                    try {

                        if (temp.length > 0) {
                            temp = [];
                            errorCode = {};
                        }

                        if (document.getElementById("reddit_settings_include_date").checked && !document.getElementById("reddit_settings_prefer_locale_format").checked && document.getElementById("reddit_settings_custom_date_format").value == "custom") {
                            ValidateDateTimeFormat("redditCustomDateFormat", document.getElementById("reddit_settings_custom_date_format").value);
                        }
                        temp.push(ValidatePrefix("redditCustomPrefix", document.getElementById("reddit_settings_custom_prefix").value));

                        temp.forEach((x) => {
                            if (x.is_error == true) {
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
                        Settings.Save("redditPreferLocaleFormat", document.getElementById("reddit_settings_prefer_locale_format").checked);

                        // See dev note #1
                        Settings.Save("redditCustomDateFormat", document.getElementById("reddit_settings_custom_date_format").value);

                        messageBox.Save();
                    } catch (e) {
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

            case "button_download_all":
                buttons.addEventListener("click", (()=>{
                    let isDone = false;
                    function createZip(zipName){
                        
                        let downloadJSONData = Settings.Load().General;
                        downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];
                        if (typeof downloadJSONData == "string" && downloadJSONData.length == 0) {
                            return swal({
                                title: chrome.i18n.getMessage("downloads_section_dialog_empty_queue_title"),
                                text: chrome.i18n.getMessage("downloads_section_empty_queue"),
                                icon: "error",
                                buttons: false,
                                dangerMode: false
                            });
                        }
                        
                        downloadJSONData = JSON.parse(downloadJSONData);
                        
                        let zip = new JSZip();
                        downloadJSONData.forEach((x)=>{
                            zip.file(x.filename, urlToPromise(x.url), { binary: true});
                        });
                        zip.generateAsync({
                            type: "blob",streamFiles: true
                        }, function updateCallback(metaData){

                            if(metaData.currentFile) {
                                
                                if (metaData.percent > 0){
                                    msg = `${chrome.i18n.getMessage("downloads_section_saving_file")} ${metaData.currentFile} ${chrome.i18n.getMessage("downloads_section_saving_file_2")} ${metaData.percent.toFixed(2)}%`;
                                } else if (metaData.percent == 0){
                                    msg = `${chrome.i18n.getMessage("downloads_section_saving_file_3")}`
                                }

                                swal({
                                    title: chrome.i18n.getMessage("downloads_section_downlaod_in_progress"),
                                    text: `${msg}`,
                                    closeOnClickOutside: false,
                                    buttons: false
                                })

                            }

                        }).then(function callback(blob){
                            saveAs(blob, zipName)
                            swal({
                                title: chrome.i18n.getMessage("downloads_section_downlaod_complete_title"),
                                text: zipName,
                                icon: "success"
                            }).then(()=>{
                                Settings.Save("global_download_queue_data", "");
                                window.location.reload();
                                DownloadManager.UpdateBadge();
                                Utility.SetBadgeText(0);
                            });

                        });
                       return isDone;
                    }


                    swal({
                        text: chrome.i18n.getMessage("downloads_section_dialog_enter_zip_name"),
                        content: "input",
                        button: {
                          text: chrome.i18n.getMessage("downloads_section_dialog_enter_zip_name_button_create"),
                          closeModal: false,
                        },
                      })
                      .then(name => {
                        if (!name) throw null;

                       return createZip(name);
                      }).catch(error =>{
                        if (error == null){
                            swal({
                                title: chrome.i18n.getMessage("error_title"),
                                text: chrome.i18n.getMessage("error_download_queue_invalid_file_name"),
                                icon: "warning",
                            })
                        }
                        console.error(error);
                      })


                }));
                break;

            case "button_clear_queue":
                buttons.addEventListener("click", (()=>{
                    swal({
                        title: "",
                        text: chrome.i18n.getMessage("downloads_section_dialog_queue_cleared"),
                        icon: "success",
                        buttons: false,
                        dangerMode: false,
                        timer: messageBox.autoCloseTimer
                    });
                    DownloadManager.ClearDownloadQueue();
                    window.location.reload();
                }));
                break;

            case "button_open_file":
                buttons.addEventListener("click", (()=>{
                    var afilepath = document.getElementById("file_picker").value;
                    if (afilepath) {
                        var startIndex = (afilepath.indexOf('\\') >= 0 ? afilepath.lastIndexOf('\\') : afilepath.lastIndexOf('/'));
                        var filename = afilepath.substring(startIndex);
                        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                            filename = filename.substring(1);
                        }
                    }
                    console.log("FILE PATH: " + filename);

                }))
                break;


        }
    });

    document.querySelectorAll("input[type=checkbox]").forEach((input) => {

        switch (input.id) {
            case "twitter_settings_include_date_checkbox":
                input.addEventListener("change", (() => {

                    Utility.UpdateFieldDisplay("checkbox", input.checked, "twitter_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "twitter_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "twitter_settings_custom_date_format");

                }));
                break;

            case "lineblog_settings_include_date":
                input.addEventListener("change", (() => {
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "lineblog_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "lineblog_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "lineblog_settings_custom_date_format");
                }));
                break;

            case "reddit_settings_include_date":
                input.addEventListener("change", (() => {
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "reddit_settings_prefer_locale_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "reddit_settings_select_date_format");
                    Utility.UpdateFieldDisplay("checkbox", input.checked, "reddit_settings_custom_date_format");
                }));
                break;
        }

    });

}));

function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function createDownloadCardItem(indexNumber, objData){

    let download_card_container = document.getElementById("download_card_container");
    let download_card_container_history = document.getElementById("download_card_container_history");
    let download_queue_label = document.getElementById("download-queue-label");
    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (0)`;

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];

    /**
     * This scenario triggers on a fresh installation as by default, it is a string value.
     */
    if (typeof downloadJSONData == "string" && downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    }

    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    } 
   

    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (${downloadJSONData.length})`;

    let buttonIds = [];
    downloadJSONData.forEach((x, idx)=>{
        
        buttonIds.push({
            primary: `download-primary-${idx}`,
            secondary: `download-secondary-${idx}`,
            download_card_ids: `download-card-${idx}`,
            index_count: idx
        });
        download_card_container.innerHTML += `
        <div class="download-card" id="download-card-${idx}">
            <img class="image-thumbnail image-thumbnail-${idx}" src="${x.url}"></img>
            <div class="download-card-info download-card-info-${idx}">
                <div class="download-card-site download-card-site-${idx}">${x.website}</div>
                <div class="download-card-info download-card-info-${idx}">${x.filename_display}</div>
            </div>
            <div class="download-card-actions" id="download-card-actions">
                <button id="download-secondary-${idx}" class="download-card-actions-button-secondary value="${idx}">${chrome.i18n.getMessage("downloads_section_button_remove")}</button>
                <button id="download-primary-${idx}" class="download-card-actions-button-primary" value="${idx}">${chrome.i18n.getMessage("downloads_section_button_download")}</button>
            </div>
        </div>
        `;
    });
    updateDownloadButtonListeners(buttonIds);
    buttonIds = []; // Clear when done

}

function createDownloadHistoryCardItem(indexNumber, objData){

    let download_card_container = document.getElementById("download_card_container_history");
    let download_card_container_history = document.getElementById("download_card_container_history");
    let download_queue_label = document.getElementById("download-queue-label");
    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (0)`;

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_history_data").map((x) => x.value)[0];

    /**
     * This scenario triggers on a fresh installation as by default, it is a string value.
     */
    if (typeof downloadJSONData == "string" && downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    }

    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    } 
   

    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (${downloadJSONData.length})`;

    let buttonIds = [];
    downloadJSONData.forEach((x, idx)=>{
        
        buttonIds.push({
            primary: `download-primary-${idx}`,
            secondary: `download-secondary-${idx}`,
            download_card_ids: `download-card-${idx}`,
            index_count: idx
        });
        download_card_container.innerHTML += `
        <div class="download-card" id="download-card-${idx}">
            <img class="image-thumbnail image-thumbnail-${idx}" src="${x.url}"></img>
            <div class="download-card-info download-card-info-${idx}">
                <div class="download-card-site download-card-site-${idx}">${x.website}</div>
                <div class="download-card-info download-card-info-${idx}">${x.filename}</div>
            </div>
            <div class="download-card-actions" id="download-card-actions">
                <button id="download-secondary-${idx}" class="download-card-actions-button-secondary value="${idx}">${chrome.i18n.getMessage("downloads_section_button_remove")}</button>
                <button id="download-primary-${idx}" class="download-card-actions-button-primary" value="${idx}">${chrome.i18n.getMessage("downloads_section_button_download")}</button>
            </div>
        </div>
        `;
    });
    updateDownloadButtonListeners(buttonIds);
    buttonIds = []; // Clear when done

}

function updateDownloadButtonListeners(downloadBtns){

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];
    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0 || typeof downloadJSONData != "object") return;

    downloadBtns.forEach((x)=>{
    
        document.querySelectorAll("button").forEach((buttons) => {
            
            if (x.secondary == buttons.id){
                buttons.addEventListener("click", ((e) => {

                    swal({
                        title: "Remove from Queue",
                        text: "Are you sure you want to remove this file?",
                        icon: "warning",
                        buttons: {
                            cancel: true,
                            confirm: true
                        }
                    }).then((result)=>{
                        if (result){
                            let id = e.target.id;
                            id = id.split("-")[2]; // Temp workaround as for some reason, there is no value despite it being entered in the for-loop
    
                            downloadJSONData = downloadJSONData.filter((v,idx)=>idx != +id);
                            Settings.Save("global_download_queue_data", JSON.stringify(downloadJSONData));
                            Utility.SetBadgeText(downloadJSONData.length);
                            window.location.reload();
                        }
                    }).catch((error)=> console.error(error));
                }));
            }

            if (x.primary == buttons.id){
                buttons.addEventListener("click", ((e) => {
                    data = downloadJSONData.filter((v,idx)=>idx == e.target.value)[0];
                    DownloadManager.StartDownload([{filename: data.filename, url: data.url}]);

                    // Remove once downloaded
                    data = downloadJSONData.filter((v, idx) => idx != e.target.value);
                    Settings.Save("global_download_queue_data", JSON.stringify(data));

                }));
            }

        });
        
    });
    
}
