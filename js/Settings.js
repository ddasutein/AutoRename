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
 * SETTINGS API
 * 
 * Retrieves or save extension settings
 * 
 * @api `Save` Save settings to local stroage. Usage: Settings.Save(keyName, value)
 * @api `Load` Load settings. Usage: Settings.Load().All
 */
let Settings = {};

(()=>{
    console.log("Settings service started")

    let SettingsMap = [];

    const Category = {
        General: "General",
        LINE_BLOG: "LINE BLOG",
        Twitter: "Twitter",
        Reddit: "Reddit",
        Options: "OptionsUI",
        Threads: "Threads",
        Bluesky: "Bluesky"
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
        global_enable_save_as_window: false,
        global_notifications_updated: true,
        global_use_autorename_folder: false,
        global_download_queue_data: "",
        global_download_history_data: "",
        global_prefer_locale_format: true,
        global_date_format: "custom",
        global_custom_date_format: "",
        global_theme: "auto",
        global_notification_play_sound_fx: true,

        //#endregion
    
        //#region Twitter Settings
        twitter_include_mention_symbol: false,
        twitter_include_tweet_id: true,
        twitter_include_date: false,
        twitter_random_string_length: "4",
        twitter_include_website_title: false,
        twitter_prefer_locale_format: true,
        twitter_date_format: "custom",
        twitter_settings_custom_date_format: "",
        twitter_settings_custom_prefix: "",
        twitter_save_image_to_folder_based_on_username: false,
        twitter_settings_download_as_jpeg: false,
        twitter_settings_set_timestamp_preference: "systemtime",
        //#endregion
    
        //#region LINE BLOG Settings
        lbPrefIncludeWebsiteTitle: false,
        lbPrefIncludeBlogTitle: true,
        lbPrefUseDate: false,
        lbPrefStringGenerator: "4",
        lineblog_convert_title_romaji: false,
        lineblogPreferLocaleFormat: true,
        lineblogDateFormat: "custom",
        lineblogCustomDateFormat: "",
        lineblogCustomPrefix: "",
        //#endregion

        //#region THREADS SETTINGS
        threadsIncludeWebsiteTitle: false,
        threadsIncludeDate: false,
        threadsRandomStringLength: 4,
        threadsPreferLocaleFormat: true,
        threadsDateFormat: "custom",
        threadsCustomDateFormat: "",
        threadsCustomPrefix: "",
        threadsSaveImageToFolderBasedOnUsername: false,
    
        //#region Reddit Settings
        redditIncludeWebsite: false,
        redditIncludePostID: true,
        redditStringGenerator: "4",
        redditIncludeDate: false,
        redditPreferLocaleFormat: true,
        redditDateFormat: "custom",
        redditCustomDateFormat: "",
        redditCustomPrefix: "",

        //#region Bluesky Settings
        blueskyIncludeWebsite: false,
        blueskyIncludeDate: false,
        blueskyRandomStringLength: 4,
        blueskySaveImageToFolderBasedOnUsername: false,
        blueskyCustomPrefix: "",
        //#endregion

        //#region Options UI settings
        optionsUITabName: "#general",
        optionsUITabIndexNumber: 2 // Default 
    
        //#endregion
    
    
    
    }, function (items) {

        SettingsMap.push(
    
            //#region General Settings
            {
                category: Category.General,
                name: chrome.i18n.getMessage("general_settings_show_download_folder"),
                value: items.global_show_download_folder,
                key: "global_show_download_folder"
            }, {
                category: Category.General,
                name: chrome.i18n.getMessage("general_settings_enable_save_as_dialog"),
                value: items.global_enable_save_as_window,
                key: "global_enable_save_as_window"
            }, {
                category: Category.General,
                name: chrome.i18n.getMessage("general_settings_enable_notifications_on_update"),
                value: items.global_notifications_updated,
                key: "global_notifications_updated"
            }, {
                category: Category.General,
                name: "Save image to AutoRename folder",
                value: items.global_use_autorename_folder,
                key: "global_use_autorename_folder"
            }, {
                category: Category.General,
                name: "Download Queue",
                value: items.global_download_queue_data,
                key: "global_download_queue_data"
            }, {
                category: Category.General,
                name: "Download History",
                value: items.global_download_history_data,
                key: "global_download_history_data"
            }, {
                category: Category.General,
                name: chrome.i18n.getMessage("common_label_prefer_locale_format"),
                value: items.global_prefer_locale_format,
                key: "global_prefer_locale_format"
            }, {
                category: Category.General,
                name: chrome.i18n.getMessage("common_label_date_format"),
                value: items.global_date_format,
                key: "global_date_format"
            }, {
                category: Category.General,
                name: chrome.i18n.getMessage("common_label_custom_date_format"),
                value: items.global_custom_date_format,
                key: "global_custom_date_format"
            }, {
                category: Category.General,
                name: "appearance",
                value: items.global_theme,
                key: "global_theme"
            }, {
                category: Category.General,
                name: "Play sound effect",
                value: items.global_notification_play_sound_fx,
                key: "global_notification_play_sound_fx"
            },
            
            //#endregion
    
            //#region Twitter Settings
            {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("twitter_settings_include_mention_symbol"),
                value: items.twitter_include_mention_symbol,
                key: "twitter_include_mention_symbol"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("twitter_settings_include_tweet_id"),
                value: items.twitter_include_tweet_id,
                key: "twitter_include_tweet_id"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("common_label_generator_length"),
                value: items.twitter_random_string_length,
                key: "twitter_random_string_length"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("twitter_settings_include_date"),
                value: items.twitter_include_date,
                key: "twitter_include_date"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("twitter_settings_site_title"),
                value: items.twitter_include_website_title,
                key: "twitter_include_website_title"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("common_label_prefer_locale_format"),
                value: items.twitter_prefer_locale_format,
                key: "twitter_prefer_locale_format"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("common_label_date_format"),
                value: items.twitter_date_format,
                key: "twitter_date_format"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("common_label_custom_date_format"),
                value: items.twitter_settings_custom_date_format,
                key: "twitter_settings_custom_date_format"
            }, {
                category: Category.Twitter,
                name: chrome.i18n.getMessage("common_section_custom_prefix"),
                value: items.twitter_settings_custom_prefix,
                key: "twitter_settings_custom_prefix"
            }, {
                category: Category.Twitter,
                name: "Save image to folder based on username",
                value: items.twitter_save_image_to_folder_based_on_username,
                key: "twitter_save_image_to_folder_based_on_username"
            }, {
                category: Category.Twitter,
                name: "Download as JPEG",
                value: items.twitter_settings_download_as_jpeg,
                key: "twitter_settings_download_as_jpeg"
            }, {
                category: Category.Twitter,
                name: "Set Timestamp Preference",
                value: items.twitter_settings_set_timestamp_preference,
                key: "twitter_settings_set_timestamp_preference"
            },
            //#endregion
    
            //#region Reddit Settings
            {
                category: Category.Reddit,
                name: chrome.i18n.getMessage("reddit_settings_site_title"),
                value: items.redditIncludeWebsite,
                key: "redditIncludeWebsite"
            }, {
                category: Category.Reddit,
                name: chrome.i18n.getMessage("reddit_settings_subreddit_post_id"),
                value: items.redditIncludePostID,
                key: "redditIncludePostID"
            }, {
                category: Category.Reddit,
                name: chrome.i18n.getMessage("common_label_generator_length"),
                value: items.redditStringGenerator,
                key: "redditStringGenerator"
            }, {
                category: Category.Reddit,
                name: chrome.i18n.getMessage("reddit_settings_include_date"),
                value: items.redditIncludeDate,
                key: "redditIncludeDate"
            }, {
                category: Category.Reddit,
                name: chrome.i18n.getMessage("common_section_custom_prefix"),
                value: items.redditCustomPrefix,
                key: "redditCustomPrefix"
            },
            //#endregion

            //#region Threads Settings
            {
                category: Category.Threads,
                name: "threadsIncludeWebsiteTitle",
                value: items.threadsIncludeWebsiteTitle,
                key: "threadsIncludeWebsiteTitle"
            },
            {
                category: Category.Threads,
                name: "threadsIncludeDate",
                value: items.threadsIncludeDate,
                key: "threadsIncludeDate"
            },
            {
                category: Category.Threads,
                name: "threadsRandomStringLength",
                value: items.threadsRandomStringLength,
                key: "threadsRandomStringLength"
            },
            {
                category: Category.Threads,
                name: "threadsCustomPrefix",
                value: items.threadsCustomPrefix,
                key: "threadsCustomPrefix"
            },
            {
                category: Category.Threads,
                name: "threadsSaveImageToFolderBasedOnUsername",
                value: items.threadsSaveImageToFolderBasedOnUsername,
                key: "threadsSaveImageToFolderBasedOnUsername"
            },

            //#endregion Threads Settings END

            //#region Bluesky
            {
                category: Category.Bluesky,
                name: "Include Website Title (Bluesky)",
                value: items.blueskyIncludeWebsite,
                key: "blueskyIncludeWebsite"
            },
            {
                category: Category.Bluesky,
                name: "Include Date",
                value: items.blueskyIncludeDate,
                key: "blueskyIncludeDate"
            },
            {
                category: Category.Bluesky,
                name: "Bluesky Random String Generator",
                value: items.blueskyRandomStringLength,
                key: "blueskyRandomStringLength"
            },
            {
                category: Category.Bluesky,
                name: "Save Image to folder based on username",
                value: items.blueskySaveImageToFolderBasedOnUsername,
                key: "blueskySaveImageToFolderBasedOnUsername"
            },
            {
                category: Category.Bluesky,
                name: "Bluesky Prefix",
                value: items.blueskyCustomPrefix,
                key: "blueskyCustomPrefix"
            },
            //#endregion

            //#region Options UI
            {
                category: Category.Options,
                name: "Options Tab",
                value: items.optionsUITabName,
                key: "optionsUITabName"
            },
            {
                category: Category.Options,
                name: "Options Tab Index",
                value: items.optionsUITabIndexNumber,
                key: "optionsUITabIndexNumber"
            }
        );
    });
    
    /**
     * Whenever settings are changed, it should update the Settings Map array
     */
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
    
            SettingsMap.map(function (x) {
                if (key == x.key) {
                    x.value = storageChange.newValue;
                }
            })
        }
    });

    
    /**
     * SETTINGS API ACCESS
     *
     */
    
    Settings.Save = ((keyName, value)=>{
        let settingsObj = {};
        settingsObj[keyName] = value;
        chrome.storage.local.set(settingsObj);
    });

    Settings.Load = (() => {
        return {
            All: SettingsMap.map((x) => x),
            General: SettingsMap.filter((key)=>{
                return key.category == Category.General;
            }),
            Twitter: SettingsMap.filter((key)=>{
                return key.category == Category.Twitter;
            }),
            LINE_BLOG: SettingsMap.filter((key)=>{
                return key.category == Category.LINE_BLOG;
            }),
            Reddit: SettingsMap.filter((key)=>{
                return key.category == Category.Reddit;
            }),
            OptionsUI: SettingsMap.filter((key)=>{
                return key.category == Category.Options;
            }),
            DownloadQueue: SettingsMap.filter((key)=>{
                return key.category == Category.General && key.key == "global_download_queue_data";
            }).map((x,idx,arr)=>{
                if (arr.length > 1){
                    return JSON.parse(arr[0].value);
                } else {
                    return null
                }
            }),
            Threads: SettingsMap.filter((key)=>{
                return key.category == Category.Threads;
            }),
            Bluesky: SettingsMap.filter((key) => {
                return key.category == Category.Bluesky;
            })
        }
    });
})();
