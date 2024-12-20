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

var Bluesky = {

    Settings: (() => {
        return Settings.Load().Bluesky.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {})
    }),

    GetUsername: ((url) => {
        let username = "";
        url = url.split("/")[4];
        username = url;
        return username;
    }),

    GetPostID: ((url) => {
        let postId = "";
        url = url.split("/");
        let hasPost = url.some((x => x == "post"));
        if (hasPost == true){
            postId = url[6];
        }
        return postId;
    }),

    GetDomain: ((url) => {

        const isUsingBKSYDomain = ((arr) => {
            arr = arr.split(".");
            console.log(arr);
            let counter = 0;
            let defaultDomain = ("bsky.social").split(".")

            if (arr.length == 2){
                return false;
            }

            if (arr.length > 2){
                arr.forEach((x) => {
                    let isMatchedToDefault = defaultDomain.some((dd => dd == x));
                    if (isMatchedToDefault){
                        counter++
                    }
                });
            }

            if (counter == 2){
                return true;
            } else {
                return false;
            }
        });

        const getDomain = ((isBSKYDomain = true, username) => {
            username = username.split(".");

            if (isBSKYDomain == true){
                return "bsky.social";
            } else {
        
                if (username.length == 2){
                    return username.join(".");
                }
        
                if (username.length == 3){
                    username = [username[1], username[2]]
                    return username.join(".")
                }
                console.log(username)
            }
        });
        
        let BSKYUsername = Bluesky.GetUsername(url);
        isBSKYDomain = isUsingBKSYDomain(BSKYUsername);
        domainName = getDomain(isBSKYDomain, BSKYUsername);
        return domainName;
    }),

    Parameters: (() => WebsiteConfigObject.filter((x => x.uri == Website.Bluesky))[0]),

    SaveMedia: ((data, contextMenuSelectedId) => {
        
        function DetermineImageFormat(url){
            let fileformat = "";
            const ImageFormats = ["jpg", "jpeg", "JPEG", "JPG", "png", "PNG"];

            url = url.split("/");

            let hasImageFormat = ImageFormats.some((ex)=>{
                return url[url.length - 1].endsWith(ex);
            });
            
            if (hasImageFormat){
                fileformat = url[url.length - 1].split("@")[1];
            }
            
            return fileformat;
        }

        const GlobalSettings = Settings.Load().General.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        const BKSY              = Bluesky.Parameters();
        const BKSYUrl           = Bluesky.ViewOriginalImage(data, false);
        const BSKYTitle         = BKSY.name;
        const BKSYUsername      = Bluesky.GetUsername(data.tab_url);
        const BKSYDomain        = Bluesky.GetDomain(data.tab_url);
        const BKSYPostID        = Bluesky.GetPostID(data.tab_url);
        const BSKYSettings      = Bluesky.Settings();
        const DateUtils         = Utility.DateUtils();
        const CurrentTime       = DateUtils.GetCurrentTime();
        const CurrentFormat     = DateUtils.GetUserFormat();
        const BSKY_TS = DateUtils.SetupDateFormat({
            inputDate: CurrentTime,
            preferLocaleFormat: false,
            dateFormat: CurrentFormat
        });
        let BSKYObject          = {}

        BSKYObject["bsky_username"] = BKSYUsername;
        BSKYObject["bsky_post_id"] = BKSYPostID;

        contextMenuSelectedId == ContextMenuID.SaveImageWithPrefix ? BSKYObject["prefix"] = BSKYSettings["blueskyCustomPrefix"].value : undefined;

        BSKYSettings["blueskyIncludeWebsite"].value ? BSKYObject["website_title"] = "Bluesky" : "";
        BSKYSettings["blueskyIncludeDate"].value ? BSKYObject["date"] = BSKY_TS : "";

        BSKYObject["randomstring"] = Utility.GenerateRandomString(BSKYSettings["blueskyRandomStringLength"].value);

        FILE_NAME_FORMAT = BKSY.file_name;
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.split("-");
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.map((FNF)=>{
            let hasReplacedValue = false;
            for (let BFN in BSKYObject){
                if (FNF == `{${BFN}}`) {
                    FNF = FNF.replace(`{${BFN}}`, BSKYObject[BFN]);
                    hasReplacedValue = true;
                    break;
                }
            }
            return hasReplacedValue ? FNF : null;
        }).filter((x => x != null)).join("-");

        const ImageFormat = DetermineImageFormat(data.info_url);
        FILE_NAME = `${FILE_NAME_FORMAT}.${ImageFormat}`;
        
        if (GlobalSettings["global_use_autorename_folder"].value && BSKYSettings["blueskySaveImageToFolderBasedOnUsername"].value){
            FILE_NAME = BSKYSettings["blueskySaveImageToFolderBasedOnUsername"].value ? `${BKSYUsername}/${FILE_NAME}` : FILE_NAME;
        }

        let BlueskyProp = []

        switch (contextMenuSelectedId){

            case ContextMenuID.SaveImage:
            case ContextMenuID.SaveImageWithPrefix:
                BlueskyProp.push({
                    filename: `${FILE_NAME}`,
                    filename_display: FILE_NAME,
                    url: BKSYUrl,
                    website: BSKYTitle,
                });
                DownloadManager.StartDownload(BlueskyProp);
                break;

            case ContextMenuID.ViewOriginalImage:
                Bluesky.ViewOriginalImage(data, true);
                break;

            case ContextMenuID.AddDownloadQueue:
                BlueskyProp.push({
                    filename: `${FILE_NAME}`,
                    filename_display: FILE_NAME,
                    url: BKSYUrl,
                    website: BSKYTitle,
                });
                DownloadManager.AddDownloadQueue(BlueskyProp);
                break;
        }
    }),

    ViewOriginalImage: ((url, openNewTab = true) => {
        url = url.info_url;
        if (!!url){
            url = url.replace("feed_thumbnail", "feed_fullsize");
            if (openNewTab == true){
                Utility.CreateNewTab(url)
            } else {
                return url;
            }
        }
    })

}