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

function SaveLINEBlogMedia(tabUrl, url, linkUrl, customObj){

    if (BrowserTabInfo.URL.match(Website.LINE_BLOG)){
        lineblogTitle = BrowserTabInfo.Title.split("-")[1] != undefined ? BrowserTabInfo.Title.split("-")[1].trim().toString() : "";
    }

    if (Utility.SplitURL(tabUrl, 5) == undefined){
        alert(chrome.i18n.getMessage("error_lineblog_click_blog"));
        return;
    } else {
        lineblogId = Utility.SplitURL(tabUrl, 5).toString().replace(".html", "").trim();
    }

    function buildFileName(fileNameObj){
        let temp;
        let isUsingDateFormat;
        // temp = `LINE BLOG-${fileNameObj.username}-${lineblogId}-${fileNameObj.blogtitle}-{date}-{string}`;
        temp = `{prefix}-{website_title}-{username}-{lineblogId}-{lineblogtitle}-{date}-{string}`;
        temp = temp.split("-");

        const lineBlogConfig = Settings.Load().LINE_BLOG.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

        if (!lineBlogConfig["lbPrefIncludeWebsiteTitle"].value){
            Utility.RemoveUnusedParameter(temp, "{website_title}");
        } else {
            temp[temp.indexOf("{website_title}")] = `LINE BLOG`;
        }

        if (!lineBlogConfig["lbPrefIncludeBlogTitle"].value){
            Utility.RemoveUnusedParameter(temp, "{lineblogtitle}");
        } else {
            temp[temp.indexOf("{lineblogtitle}")] = fileNameObj.blogtitle;
        }

        if (lineBlogConfig["lbPrefStringGenerator"].value == "0"){
            Utility.RemoveUnusedParameter(temp, "{string}");
        } else {
            temp[temp.indexOf("{string}")] = Utility.GenerateRandomString(lineBlogConfig["lbPrefStringGenerator"].value);
        }

        if (!lineBlogConfig["lbPrefUseDate"].value){
            Utility.RemoveUnusedParameter(temp, "{date}");
        } else {

            let prefObj = {};

            if (lineBlogConfig["lineblogPreferLocaleFormat"].value == true){
                prefObj["prefer_locale_format"] = true;
                const timedateValue = getTimeDate(prefObj);
                temp[temp.indexOf("{date}")] = timedateValue;
            } else {

                prefObj["prefer_locale_format"] = false;

                if (lineBlogConfig["lineblogDateFormat"].value == "custom"){
                    prefObj["date_format"] = lineBlogConfig["lineblogCustomDateFormat"].value;
                } else {
                    prefObj["date_format"] = GetDateFormat(lineBlogConfig["lineblogDateFormat"].value)
                }

                const timedateValue = getTimeDate(prefObj);
                temp[temp.indexOf("{date}")] = timedateValue;

            }

        }

        if (customObj.use_prefix == true){

            if (lineBlogConfig["lineblogCustomPrefix"].value == ""){
                Utility.RemoveUnusedParameter(temp, "{prefix}");
            } else {
                temp[temp.indexOf("{prefix}")] = lineBlogConfig["lineblogCustomPrefix"].value;
            }

        } else {
            Utility.RemoveUnusedParameter(temp, "{prefix}");
        }

        temp[temp.indexOf("{username}")] = fileNameObj.username;
        temp[temp.indexOf("{lineblogId}")] = lineblogId;

        return temp.toString().replace(/,/g, "-");
    }

    let lineBlogImageFile = [];
    let fileNameObj = {};

    fileNameObj["username"]= Utility.SplitURL(tabUrl, 3);
    fileNameObj["blogtitle"] = lineblogTitle;
    lineBlogImageFile.push({
        filename: buildFileName(fileNameObj) + ".jpg",
        url: url
    });
    console.log(customObj);
    if (customObj.download_queue == true){
        AddToDownloadQueue(lineBlogImageFile[0].url, lineBlogImageFile[0].filename, "LINE BLOG")
    } else {
        StartDownload(lineBlogImageFile);
    }

}