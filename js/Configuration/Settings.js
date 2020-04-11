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

let SettingsArray = [];

let CategoryEnum = {
    General: "General",
    LINE_BLOG: "LINE BLOG",
    Twitter: "Twitter"
}

chrome.storage.local.get({
    // General Settings
    showDownloadFolderCheckbox: false,

    // Twitter Settings
    fileNameStringLength: "8",
    showMentionSymbol: true,
    showTweetId: true,
    twitterFileExtensionType: ".jpg",
    useDate: false,
    dateFormatting: "0",

    // LINE BLOG
    lbPrefIncludeWebsiteTitle: false,
    lbPrefIncludeBlogTitle: false,
    lbPrefUseDate: false,
    lbPrefDateFormat: "0",
    lbPrefStringGenerator: "4"

}, function (items) {

    SettingsArray.push(

        {
            category: CategoryEnum.General,
            name: chrome.i18n.getMessage("settings_general_settings_show_download_folder"),
            value: items.showDownloadFolderCheckbox,
            key: "showDownloadFolderCheckbox"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("settings_twitter_include_mention_symbol"),
            value: items.showMentionSymbol,
            key: "showMentionSymbol"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("settings_twitter_include_tweet_id"),
            value: items.showTweetId,
            key: "showTweetId"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("settings_generate_string"),
            value: items.fileNameStringLength,
            key: "fileNameStringLength"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("settings_twitter_include_tweet_date"),
            value: items.useDate,
            key: "useDate"
        }, {
            category: CategoryEnum.Twitter,
            name: "Date Format",
            value: items.dateFormatting,
            key: "dateFormatting"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("setting_include_lineblog_web_title"),
            value: items.lbPrefIncludeWebsiteTitle,
            key: "lbPrefIncludeWebsiteTitle"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("setting_include_lineblog_blog_title"),
            value: items.lbPrefIncludeBlogTitle,
            key: "lbPrefIncludeBlogTitle"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("settings_twitter_include_tweet_date"),
            value: items.lbPrefUseDate,
            key: "lbPrefUseDate"
        }, {
            category: CategoryEnum.Twitter,
            name: "Date Format",
            value: items.lbPrefDateFormat,
            key: "lbPrefDateFormat"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("settings_generate_string"),
            value: items.lbPrefStringGenerator,
            key: "lbPrefStringGenerator"
        },
    );
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];

        SettingsArray.map(function (x) {
            if (key == x.key) {
                x.value = storageChange.newValue;
            }
        })
    }
});