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

const Threads = {

    InfoUrl: null,
    TabUrl: null,
    LinkUrl: null,

    Parameters: (() => WebsiteConfigObject.filter((x => (x.uri).includes(Website.Threads)))[0]),

    Settings: (()=>{
        return Settings.Load().Threads.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {})
    }),

    ParseURL: (() => {
        let _url = Threads.TabUrl;

        let urlObj = {};
        _url = _url.split("/");
        _url[3] != undefined ? urlObj["username"] = _url[3] : urlObj["username"] = null;
        _url[5] != undefined ? urlObj["post_id"] = _url[5] : urlObj["post_id"] = null;
        return urlObj;

    }),

    GetUsername: (() => {
        return Threads.ParseURL().username;
    }),

    GetPostId: (() => {
        return Threads.ParseURL().post_id;
    }),

    GetImageFormat: (() => {

        const imageFormats = [".jpg", ".jpeg", ".png", ".webp"];
        let mLink = Threads.InfoUrl;
        mLink = mLink.split("?")[0];
        let src = "";
        if (imageFormats.some(x => (mLink).includes(x))) {
            src = mLink.split("/")[5];
            src = src.substring(src.lastIndexOf("."));
        }
        return src;
    }),

    SaveMedia: ((data, contextMenuSelectedId) => {

        const GlobalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        Threads.InfoUrl         = data.info_url;
        Threads.TabUrl          = data.tab_url;
        Threads.LinkUrl         = data.link_url;
        const ThreadsParams     = Threads.Parameters();
        const ThreadsName       = ThreadsParams.name;
        const ThreadsSettings   = Threads.Settings();
        const ThreadsPostId     = Threads.GetPostId();
        const ThreadsGetUser    = Threads.GetUsername();
        const ThreadsImgFormat  = Threads.GetImageFormat();
        const DateUtils         = Utility.DateUtils();
        const CurrentTime       = DateUtils.GetCurrentTime();
        const CurrentFormat     = DateUtils.GetUserFormat();
        
        const ThreadsObj = {};
        ThreadsSettings["threadsIncludeWebsiteTitle"].value ? ThreadsObj["website_title"] = ThreadsName : null;
        ThreadsObj["username"] = ThreadsGetUser;
        ThreadsObj["post_id"] = ThreadsPostId;
        ThreadsSettings["threadsIncludeDate"].value ? ThreadsObj["date"] = DateUtils.SetupDateFormat({
            inputDate: CurrentTime,
            preferLocaleFormat: false,
            dateFormat: CurrentFormat
        }) : null ;
        ThreadsObj["randomstring"] = Utility.GenerateRandomString(ThreadsSettings["threadsRandomStringLength"].value);
        contextMenuSelectedId == ContextMenuID.SaveImageWithPrefix ? ThreadsObj["prefix"] = ThreadsSettings["threadsCustomPrefix"].value : null;

        FILE_NAME_FORMAT = ThreadsParams.file_name;
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.split("-");
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.map((FNF)=>{
            let hasReplacedValue = false;
            for (let BFN in ThreadsObj){
                if (FNF == `{${BFN}}`) {
                    FNF = FNF.replace(`{${BFN}}`, ThreadsObj[BFN]);
                    hasReplacedValue = true;
                    break;
                }
            }
            return hasReplacedValue ? FNF : null;
        }).filter((x => x != null)).join("-");

        let filename = FILE_NAME_FORMAT;
        let fileNameDisplay = FILE_NAME_FORMAT;

        if (GlobalSettings["global_use_autorename_folder"].value == true && ThreadsSettings["threadsSaveImageToFolderBasedOnUsername"].value == true){
            filename = `${ThreadsGetUser}/${filename}`;
        }

        let threadsFileProp = [
            {
                filename: filename + ThreadsImgFormat,
                filename_display: fileNameDisplay,
                url: Threads.InfoUrl,
                website: ThreadsName
            }
        ];

        switch (contextMenuSelectedId) {
            case ContextMenuID.SaveImage:
            case ContextMenuID.SaveImageWithPrefix:
                DownloadManager.StartDownload(threadsFileProp);
                break;

            case ContextMenuID.AddDownloadQueue:
                DownloadManager.AddDownloadQueue(threadsFileProp);
                break;

        }
    })


}