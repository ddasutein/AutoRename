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

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        loadHTMLSettings();
    }
}
document.getElementById("button_save").addEventListener("click", SaveOptions);

let loadHTMLSettings = function () {

    let generalPref = SettingsArray.filter(function (key) {
        return key.category == CategoryEnum.General;
    });

    generalPref.forEach(function (x) {
        switch (x.key) {
            case "showDownloadFolderCheckbox":
                document.getElementById("showDownloadFolderCheckbox").checked = x.value
                break;
        }
    });

    let twitterPref = SettingsArray.filter(function (key) {
        return key.category == CategoryEnum.Twitter
    });

    twitterPref.map(function (x) {
        switch (x.key) {
            case "showMentionSymbol":
                document.getElementById("twitter_mention").checked = x.value;
                break;
            case "showTweetId":
                document.getElementById("twitter_tweet_id").checked = x.value;
                break;
            case "useDate":
                document.getElementById("IsUsingDateCheckbox").checked = x.value;
                UseDateFormat(x.value);
                break;
            case "dateFormatting":
                document.getElementById("DateFormatTypeSelect").value = x.value;
                break;
            case "":
                document.getElementById("twitter_file_extension_type").value = x.value;
                break;
            case "fileNameStringLength":
                document.getElementById("twitter_string_length").value = x.value;
                break;
        }
    });

    let lineblogPref = SettingsArray.filter(function (key) {
        return key.category == CategoryEnum.LINE_BLOG
    });

    lineblogPref.map(function (x) {
        switch (x.key) {
            case "lbPrefIncludeWebsiteTitle":
                document.getElementById("lineblog_web_title").checked = x.value;
                break;
            case "lbPrefIncludeBlogTitle":
                document.getElementById("lineblog_include_title").checked = x.value;
                break;
            case "lbPrefUseDate":
                document.getElementById("lineblog_IsUsingDateCheckbox").checked = x.value;
                LineBlogUseDateFormat(x.value);
                break;
            case "lbPrefDateFormat":
                document.getElementById("lineblog_date_format").value = x.value;
                break;
            case "lbPrefStringGenerator":
                document.getElementById("lineblog_string_length").value = x.value;
                break;
        }
    });
}

function SaveOptions() {

    // General Settings
    let showDownloadFolderCheckbox = document.getElementById("showDownloadFolderCheckbox").checked;

    // Twitter Settings
    let fileNameStringLength = document.getElementById("twitter_string_length").value;
    let includeMentionSymbol = document.getElementById("twitter_mention").checked;
    let includeTweetId = document.getElementById("twitter_tweet_id").checked;
    //let twitterFileExtensionType = document.getElementById("twitter_file_extension_type").value;
    let useDate = document.getElementById("IsUsingDateCheckbox").checked;
    let dateFormatting = document.getElementById("DateFormatTypeSelect").value;

    // LINE BLOG Settings
    let lbPrefIncludeWebsiteTitle = document.getElementById("lineblog_web_title").checked;
    let lbPrefIncludeBlogTitle = document.getElementById("lineblog_include_title").checked;
    let lbPrefUseDate = document.getElementById("lineblog_IsUsingDateCheckbox").checked;
    let lbPrefDateFormatting = document.getElementById("lineblog_date_format").value;
    let lbPrefStringGenerator = document.getElementById("lineblog_string_length").value;

    SaveSettings("showDownloadFolderCheckbox", showDownloadFolderCheckbox);
    SaveSettings("showMentionSymbol", includeMentionSymbol);
    SaveSettings("showTweetId", includeTweetId);
    SaveSettings("fileNameStringLength", fileNameStringLength);
    SaveSettings("useDate", useDate);
    SaveSettings("dateFormatting", dateFormatting);
    SaveSettings("lbPrefIncludeWebsiteTitle", lbPrefIncludeWebsiteTitle);
    SaveSettings("lbPrefIncludeBlogTitle", lbPrefIncludeBlogTitle);
    SaveSettings("lbPrefUseDate", lbPrefUseDate);
    SaveSettings("lbPrefDateFormat", lbPrefDateFormatting);
    SaveSettings("lbPrefStringGenerator", lbPrefStringGenerator);
    alert(chrome.i18n.getMessage("settings_save_success"));
}

// #region Twitter
let IsUsingDateChecked = document.getElementById("IsUsingDateCheckbox");
let DateFormatTypeSelect = document.getElementById("DateFormatTypeSelect");

function UseDateFormat(IsUsingDate) {
    if (!IsUsingDate) {
        DateFormatTypeSelect.disabled = true;
    } else {
        DateFormatTypeSelect.disabled = false;
    }
}

IsUsingDateChecked.onchange = function () {
    if (!!this.checked) {
        DateFormatTypeSelect.disabled = false;
    } else {
        DateFormatTypeSelect.disabled = true;
    }
}

// #endregion
// #region LINE BLOG
let lineblogIsUsingDateChecked = document.getElementById("lineblog_IsUsingDateCheckbox");
let lineblogDateFormatTypeSelect = document.getElementById("lineblog_date_format");

function LineBlogUseDateFormat(IsUsingDate) {
    if (!IsUsingDate) {
        lineblogDateFormatTypeSelect.disabled = true;
    } else {
        lineblogDateFormatTypeSelect.disabled = false;
    }
}

lineblogIsUsingDateChecked.onchange = function () {
    if (!!this.checked) {
        lineblogDateFormatTypeSelect.disabled = false;
    } else {
        lineblogDateFormatTypeSelect.disabled = true;
    }
}
// #endregion