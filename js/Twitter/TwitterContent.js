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

var Twitter = {

    BuildFileName: ((twitterConfig, fileNameObj)=>{
        let temp;
        temp = `{prefix}-{website_title}-{username}-{tweetId}-{date}-{randomstring}`;
        temp = temp.split("-");

        if (!twitterConfig["twitter_include_mention_symbol"].value){
            temp[temp.indexOf("{username}")] = fileNameObj.username;
        } else {
            temp[temp.indexOf("{username}")] = `@${fileNameObj.username}`;
        }

        if (!twitterConfig["twitter_include_tweet_id"].value){
            Utility.RemoveUnusedParameter(temp, "{tweetId}");
        } else {
            temp[temp.indexOf("{tweetId}")] = fileNameObj.tweetId;
        }

        if (!twitterConfig["twitter_include_website_title"].value){
            Utility.RemoveUnusedParameter(temp, "{website_title}");
        } else {
            temp[temp.indexOf("{website_title}")] = "X";
        }

        if (!twitterConfig["twitter_include_date"].value){
            Utility.RemoveUnusedParameter(temp, "{date}");
        } else {
            let prefObj = {};

            if (twitterConfig["twitter_prefer_locale_format"].value == true){
                prefObj["prefer_locale_format"] = true;
                const timedateValue = getTimeDate(prefObj);
                temp[temp.indexOf("{date}")] = timedateValue;
            } else {

                prefObj["prefer_locale_format"] = false;

                if (twitterConfig["twitter_date_format"].value == "custom"){
                    prefObj["date_format"] = twitterConfig["twitter_settings_custom_date_format"].value;
                } else {
                    prefObj["date_format"] = GetDateFormat(twitterConfig["twitter_date_format"].value);
                }

                const timedateValue = getTimeDate(prefObj)
                temp[temp.indexOf("{date}")] = timedateValue;

            }

        }

        if (twitterConfig["twitter_random_string_length"].value == "0"){
            temp[temp.indexOf("{randomstring}")] = fileNameObj.photo_count;

        } else {
            temp[temp.indexOf("{randomstring}")] = Utility.GenerateRandomString(twitterConfig["twitter_random_string_length"].value);
        }

        if (fileNameObj.use_prefix == true){

            if (twitterConfig["twitter_settings_custom_prefix"].value == ""){
                Utility.RemoveUnusedParameter(temp, "{prefix}");
            } else {
                temp[temp.indexOf("{prefix}")] = twitterConfig["twitter_settings_custom_prefix"].value;
            }

        } else {
            Utility.RemoveUnusedParameter(temp, "{prefix}");
        }

        return temp.toString().replace(/,/g, "-");
    }),

    ImageFormatType : ((url)=>{
        if (url.includes("webp")){
            return "." + url.split("?format=")[1].substring(0, 4);
        } else {
            return "." + url.split("?format=")[1].substring(0, 3);
        }
    }),

    ImageSizeType : (()=> {
        const size = [{
            small: "&name=small",
            medium: "&name=medium",
            large: "&name=large",
            original: "&name=orig"
        }];
        return size.map((x => x))[0];
    }),

    MediaSrc : ((linkUrl)=>{
        let src = "";
        src = linkUrl.substring(0, linkUrl.lastIndexOf("&name=") + 0) + Twitter.ImageSizeType().large
        return src;
    }),

    ViewOriginalImage : (async (url)=>{

        twitterConfig = Settings.Load().Twitter.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        if (twitterConfig["twitter_settings_download_as_jpeg"].value == true){
            url.info_url = (url.info_url).replace("?format=webp", "?format=jpg");
        }
    
        if (url.info_url.includes("&name=")) {
            updatedUrl = url.info_url.substring(0, url.info_url.lastIndexOf("&name=") + 0) + Twitter.ImageSizeType().large
        } else {
            updatedUrl = url.info_url;
        }
        Utility.CreateNewTab(updatedUrl)
        
    }),

    SaveMedia : ( (data)=>{

        let filename = "";
        let tweetId;
        let fileNameObj = {};
        
        twitterConfig = Settings.Load().Twitter.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        generalSettings = Settings.Load().General.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        if (twitterConfig["twitter_settings_download_as_jpeg"].value == true){
            data.info_url = (data.info_url).replace("?format=webp", "?format=jpg");
        }

        const specialCharacters = /[?!@#$%^&*(),';:*-.]/g;

        // Rule 1: When full tweet is clicked then it should be prioritized first
        if (!!data.tab_url){
            if (specialCharacters.test(Utility.SplitURL(data.tab_url, 5))){
                tweetId = Utility.SplitURL(data.tab_url, 5).split(specialCharacters)[0];
            } else {
                tweetId = Utility.SplitURL(data.tab_url, 5);
            }
        } 
        
        // Rule 2: If Tweet ID is still empty then retrieve it from linkUrl
        if (tweetId == "" || tweetId == undefined || tweetId == null){
            if (!!data.link_url){
                if (specialCharacters.test(Utility.SplitURL(data.link_url, 5))){
                    tweetId = Utility.SplitURL(data.link_url, 5).split(specialCharacters)[0];
                } else {
                    tweetId = Utility.SplitURL(data.link_url, 5);
                }
            }
        }

        fileNameObj["username"] = data.link_url != undefined ? Utility.SplitURL(data.link_url, 3) : Utility.SplitURL(data.tab_url, 3);
        fileNameObj["tweetId"] = tweetId;
        fileNameObj["use_prefix"] = data.use_prefix;
        fileNameObj["photo_count"] = data.link_url != undefined ? `img${Utility.SplitURL(data.link_url, 7)}` : "img1";

        filename = Twitter.BuildFileName(twitterConfig, fileNameObj) + Twitter.ImageFormatType(data.info_url);
        
        if (generalSettings["global_use_autorename_folder"].value == true && twitterConfig["twitter_save_image_to_folder_based_on_username"].value == true){
            filename = `AutoRename/Twitter/${fileNameObj.username}/${filename}`
        } else if (generalSettings["global_use_autorename_folder"].value == true && twitterConfig["twitter_save_image_to_folder_based_on_username"].value == false){
            filename = `AutoRename/Twitter/${filename}`
        }

        let twitterFileProp = [];
        twitterFileProp.push({
            filename: filename,
            url: Twitter.MediaSrc(data.info_url),
            website: "Twitter",

        });

        data.download_queue == false ? DownloadManager.StartDownload(twitterFileProp) : DownloadManager.AddDownloadQueue(twitterFileProp);

    })

}