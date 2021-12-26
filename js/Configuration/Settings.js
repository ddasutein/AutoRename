/** MIT License
 * 
 * Copyright (c) 2021 Dasutein
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
 * Get all extension settings
 */
let SettingsArray = [];

const CategoryEnum = {
    General: "General",
    LINE_BLOG: "LINE BLOG",
    Twitter: "Twitter",
    Reddit: "Reddit"
}

chrome.storage.local.get({

    /**
     * When adding new options, you must declare them here with a default value.
     * Note: Beware that changing the name will cause settings to reset when the extension is updated.
     * 
     * Naming convention doesn't matter as long as the first prefix is referring to the website. Use the global_ prefix
     * when the setting doesn't apply to any specific website.  
     */

    //#region Global Setings
    global_show_download_folder: false,
    global_enable_save_as_window: true,
    global_notifications_updated: true,
    //#endregion

    //#region Twitter Settings
    twitter_include_mention_symbol: false,
    twitter_include_tweet_id: true,
    twitter_include_date: false,
    twitter_date_format: "0",
    twitter_random_string_length: "4",
    //#endregion

    //#region LINE BLOG Settings
    lbPrefIncludeWebsiteTitle: false,
    lbPrefIncludeBlogTitle: true,
    lbPrefUseDate: false,
    lbPrefDateFormat: "0",
    lbPrefStringGenerator: "4",
    lineblog_convert_title_romaji: false,
    //#endregion

    //#region Reddit Settings
    redditIncludeWebsite: false,
    redditIncludePostID: true,
    redditStringGenerator: "4",
    redditIncludeDate: false,
    redditDateFormat: "0"
    //#endregion



}, function (items) {

    SettingsArray.push(

        {
            category: CategoryEnum.General,
            name: chrome.i18n.getMessage("settings_general_settings_show_download_folder"),
            value: items.global_show_download_folder,
            key: "global_show_download_folder"
        }, {
            category: CategoryEnum.General,
            name: chrome.i18n.getMessage("settings_general_settings_show_download_folder"),
            value: items.global_enable_save_as_window,
            key: "global_enable_save_as_window"
        }, {
            category: CategoryEnum.General,
            name: chrome.i18n.getMessage("settings_general_settings_show_download_folder"),
            value: items.global_notifications_updated,
            key: "global_notifications_updated"
        }, {
            category: CategoryEnum.General,
            name: chrome.i18n.getMessage("settings_general_settings_show_download_folder"),
            value: items.global_enable_save_as_window,
            key: "general_settings_enable_save_as_window"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("twitter_settings_include_mention_symbol"),
            value: items.twitter_include_mention_symbol,
            key: "twitter_include_mention_symbol"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("twitter_settings_include_tweet_id"),
            value: items.twitter_include_tweet_id,
            key: "twitter_include_tweet_id"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("common_label_generator_length"),
            value: items.twitter_random_string_length,
            key: "twitter_random_string_length"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("twitter_settings_include_date"),
            value: items.twitter_include_date,
            key: "twitter_include_date"
        }, {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("common_label_date_format"),
            value: items.twitter_date_format,
            key: "twitter_date_format"
        }, 
        
        {
            category: CategoryEnum.Twitter,
            name: chrome.i18n.getMessage("twitter_settings_include_website_name"),
            value: items.twitter_include_date,
            key: "twitter_include_website_title"
        },
        
        {
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
            category: CategoryEnum.LINE_BLOG,
            name: "Date Format",
            value: items.lbPrefDateFormat,
            key: "lbPrefDateFormat"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("settings_generate_string"),
            value: items.lbPrefStringGenerator,
            key: "lbPrefStringGenerator"
        }, {
            category: CategoryEnum.LINE_BLOG,
            name: chrome.i18n.getMessage("lineblog_settings_convert_blog_title_romaji"),
            value: items.lineblog_convert_title_romaji,
            key: "lineblog_convert_title_romaji"
        }, {
            category: CategoryEnum.Reddit,
            name: chrome.i18n.getMessage("reddit_settings_site_title"),
            value: items.redditIncludeWebsite,
            key: "redditIncludeWebsite"
        }, {
            category: CategoryEnum.Reddit,
            name: chrome.i18n.getMessage("reddit_settings_subreddit_post_id"),
            value: items.redditIncludePostID,
            key: "redditIncludePostID"
        }, {
            category: CategoryEnum.Reddit,
            name: chrome.i18n.getMessage("common_label_generator_length"),
            value: items.redditStringGenerator,
            key: "redditStringGenerator"
        }, {
            category: CategoryEnum.Reddit,
            name: chrome.i18n.getMessage("reddit_settings_include_date"),
            value: items.redditIncludeDate,
            key: "redditIncludeDate"
        }, {
            category: CategoryEnum.Reddit,
            name: "Date Format",
            value: items.redditDateFormat,
            key: "redditDateFormat"
        }
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

/**
 * Save extension settings to storage
 * 
 * @param {string} keyName Storage key name
 * @param {*} value Set a value
 */
function SaveSettings(keyName, value) {
    let settingsObj = {};
    settingsObj[keyName] = value;
    console.log(settingsObj);
    chrome.storage.local.set(settingsObj);
}

let GetSettings = {

    General: () => {
        let _generalSettings = SettingsArray.filter((key) => {
            return key.category == CategoryEnum.General
        });
        return _generalSettings;
    },

    Twitter: () => {
        let _twitterSettings = SettingsArray.filter((key) => {
            return key.category == CategoryEnum.Twitter
        });

        return _twitterSettings;
    },

    LINE_BLOG: () => {
        let _lineblogSettings = SettingsArray.filter((key) => {
            return key.category == CategoryEnum.LINE_BLOG
        });

        return _lineblogSettings;
    },

    Reddit: () => {
        let _redditSettings = SettingsArray.filter((key) => {
            return key.category == CategoryEnum.Reddit
        });

        return _redditSettings;
    }

}