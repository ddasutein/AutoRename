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

var Twitter = {

    InfoUrl: null,
    TabUrl: null,
    LinkUrl: null,

    Parameters: (() => WebsiteConfigObject.filter((x => (x.uri).includes(Website.X)))[0]),

    IsArticle: ((url) => {
        
        url = Twitter.LinkUrl;

        let isXArticle = false;
        if (url != undefined){
            url = url.split("/");
            isXArticle = url.some((x => x == "article"));
        }
        return isXArticle;

    }),

    Settings: (() => {
        return Settings.Load().Twitter.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});
    }),

    ImageFormatType : (()=>{

        let XSettings = Twitter.Settings();

        url = Twitter.InfoUrl;
        if (url.includes("webp")){

            if (XSettings["twitter_settings_download_as_jpeg"].value == true){
                return "jpg";
            }

            return url.split("?format=")[1].substring(0, 4);
        } else {
            return url.split("?format=")[1].substring(0, 3);
        }
    }),

    GetImageSource : ((image_format = Twitter.ImageFormatType() )=>{

        function isValidImageFormat(format){
            
            let isValid = false;
            const supportedImageFormat = ["jpg", "png", "jpeg", "webp"];
            isValid = supportedImageFormat.some((e => e == format));
            
            if (!isValid){
                console.error("Invalid image format. Twitter/X only supports jpg, png, and webp");
                return false;
            } else {
                return true;
            }
        }

        let _imageFormat = image_format;
        if (Utility.ValidateParameter(image_format)){
            _imageFormat = image_format.format || Twitter.ImageFormatType();
        }

        _imageFormat = isValidImageFormat(_imageFormat) ? _imageFormat : Twitter.ImageFormatType();

        const Size = {
            Small: "&name=small",
            Medium: "&name=medium",
            Large: "&name=large"
        };

        let src = Twitter.InfoUrl;
        src = src.substring(0, src.lastIndexOf("&name=") + 0) + Size.Large;
        src = src.replace(/\?format=[^&]+/, `?format=${_imageFormat}`).replace(/\?(?!format)/, `?format=${_imageFormat}&`);
        return src;
    }),

    ViewOriginalImage : ( ()=>{
        Utility.CreateNewTab(Twitter.GetImageSource());
    }),

    ParseURL: (() => {

        let _url = Twitter.LinkUrl;
        let urlObj = {};

        _url = _url.split("/");
        _url[3] != undefined ? urlObj["username"] = _url[3] : urlObj["username"] = null;
        _url[5] != undefined ? urlObj["tweet_id"] = _url[5] : urlObj["tweet_id"] = null;

        return urlObj;
    }),

    GetUsername: (() => {
        return Twitter.ParseURL().username;
    }),

    GetTweetId: (() => {
        return Twitter.ParseURL().tweet_id;
    }),

    GetMediaIndex: (() => {
        let _url = Twitter.LinkUrl;
        _url = _url.split("/");
        photoIndex = _url.indexOf("photo");

        if (photoIndex != -1){
            return _url[photoIndex + 1];
        }

        return 0;
    }),

    ConvertTweetTimestamp: ((tweetId = "") => {
        
        let _tweetId = tweetId;
        
        if (Utility.ValidateParameter(_tweetId)){
            _tweetId = tweetId.tweetId || "";
        }

        if (!_tweetId) throw Error("Tweet ID not specified");
        
        const twitterEpoch = 1288834974657;
        const TweetTimeStamp = (BigInt(_tweetId) >> BigInt(22)) + BigInt(twitterEpoch);

        return TTS = new Date(Number(TweetTimeStamp));
    }),

    SaveMedia : ( (data, contextMenuSelectedId) => {

        function RandomString(length = 4){
            let _length = length;
            let _isXArticle = Twitter.IsArticle();
            let randomStr = "";

            let MediaIndex = Twitter.GetMediaIndex();
            if (Utility.ValidateParameter(length)){
                _length = length.length || length;
            }

            if (_length == "0"){
                
                if (_isXArticle){
                    const articleMediaId = (Twitter.LinkUrl).split("/")[7];
                    randomStr = articleMediaId;

                } else {
                    randomStr = `img${MediaIndex}`;
                }

            } else {
                randomStr = Utility.GenerateRandomString(_length);
            }

            return randomStr;
        }

        const GlobalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        Twitter.InfoUrl         = data.info_url;
        Twitter.TabUrl          = data.tab_url;
        Twitter.LinkUrl         = data.link_url;
        const X                 = Twitter.Parameters();
        const XSettings         = Twitter.Settings();
        const XTitle            = X.name;
        const XPostId           = Twitter.GetTweetId();
        const XUsername         = Twitter.GetUsername();
        const XImageFormat      = Twitter.ImageFormatType();
        const isViewingXArticle = Twitter.IsArticle();
        const DateUtils         = Utility.DateUtils();
        const CurrentTime       = DateUtils.GetCurrentTime();
        const CurrentFormat     = DateUtils.GetUserFormat();

        const XTimestamp = DateUtils.SetupDateFormat({
            inputDate: CurrentTime,
            preferLocaleFormat: false,
            dateFormat: CurrentFormat
        });

        const XObject = {};
        XObject["username"] = XSettings["twitter_include_mention_symbol"].value ? `@${XUsername}` : XUsername;
        XObject["randomstring"] = RandomString({
            url: data.tab_url,
            length: XSettings["twitter_random_string_length"].value
        });

        XSettings["twitter_include_tweet_id"].value ? XObject["tweetId"] = XPostId : null ;
        XSettings["twitter_include_date"].value ? XObject["date"] = XTimestamp : null ;
        contextMenuSelectedId == ContextMenuID.SaveImageWithPrefix ? XObject["prefix"] = XSettings["twitter_settings_custom_prefix"].value : null;


        FILE_NAME_FORMAT = X.file_name;
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.split("-");
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.map((FNF)=>{
            let hasReplacedValue = false;
            for (let BFN in XObject){
                if (FNF == `{${BFN}}`) {
                    FNF = FNF.replace(`{${BFN}}`, XObject[BFN]);
                    hasReplacedValue = true;
                    break;
                }
            }
            return hasReplacedValue ? FNF : null;
        }).filter((x => x != null)).join("-");

        let filename = FILE_NAME_FORMAT;
        let fileNameDisplay = FILE_NAME_FORMAT;

        if (GlobalSettings["global_use_autorename_folder"].value == true && ["twitter_save_image_to_folder_based_on_username"].value == true){
            filename = XSettings["twitter_save_image_to_folder_based_on_username"].value ? `${XUsername}/${filename}` : filename;
        }

        filename = `${filename}.${XImageFormat}`;

        let twitterFileProp = [];

        switch (contextMenuSelectedId){
            case ContextMenuID.SaveImage:
                twitterFileProp.push({
                    filename: filename,
                    filename_display: fileNameDisplay,
                    url: Twitter.GetImageSource(),
                    website: XTitle,
        
                });
                DownloadManager.StartDownload(twitterFileProp);
                break;

            case ContextMenuID.SaveImageWithPrefix:
                twitterFileProp.push({
                    filename: filename,
                    filename_display: fileNameDisplay,
                    url: Twitter.GetImageSource(),
                    website: XTitle,
        
                });
                DownloadManager.StartDownload(twitterFileProp);
                break;

            case ContextMenuID.ViewOriginalImage:
                Twitter.ViewOriginalImage(data);
                break;

            case ContextMenuID.AddDownloadQueue:
                twitterFileProp.push({
                    filename: filename,
                    filename_display: fileNameDisplay,
                    url: Twitter.GetImageSource(),
                    website: XTitle,
        
                });
                DownloadManager.AddDownloadQueue(twitterFileProp);
                break;

        }

    })

}