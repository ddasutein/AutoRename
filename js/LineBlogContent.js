/** MIT License
 * 
 * Copyright (c) 2019 Dasutein
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

/** For reference in saveImageEvent.js */
let LineBlogContentJS = {
    FinalURL: null,
    FileName: null
}

let LineBlogFileNameArray = [];

let lineBlogCurrentUrl = null;
let lineBlogTabTitle = null;

function LINEBLOGTitle(tab){
    let tabTitle = tab.split("-");
    lineBlogTabTitle = tabTitle[1];
}

function LineBlogURL(imageURL, currentUrl) {
    console.log("LineBlogURL (imageURL)", imageURL);
    console.log("LineBlogURL (currentUrl)", currentUrl);
    lineBlogCurrentUrl = currentUrl;

    const blogId = SplitURL(lineBlogCurrentUrl, 4);

    if (blogId == ""){
        alert("You must click on the blog post to save this image");
    }

    LINEBlogImageURL(imageURL);
}

let finalLineBlogURL = null;

function LINEBlogImageURL(url) {
    console.log("LINEBlogImageURL", url);
    const getOriginalSize = url.substring(0, url.lastIndexOf("/") + 0);
    LineBlogContentJS.FinalURL = getOriginalSize;

    LINEBlogFileBuilder();
}


function LINEBlogFileBuilder(){
    let finalFileName = '';
    const title = SplitURL(lineBlogCurrentUrl, 2);
    const username = SplitURL(lineBlogCurrentUrl, 3);
    const blogId = SplitURL(lineBlogCurrentUrl, 5);

    const _title = title.replace(".me", "");
    const _blogId = blogId.replace(".html", "");

    chrome.storage.local.get({
        lbPrefIncludeWebsiteTitle: false,
        lbPrefIncludeBlogTitle: false,
        lbPrefUseDate: false,
        lbPrefDateFormat: "0",
        lbPrefStringGenerator: "4"

    }, function(items){
        prefWebsiteTitle = items.lbPrefIncludeWebsiteTitle;
        prefBlogTitle = items.lbPrefIncludeBlogTitle;
        prefIncludeDate = items.lbPrefUseDate;
        prefDateFormatting = items.lbPrefDateFormat;
        lbPrefStringGenerator = items.lbPrefStringGenerator;

        prefWebsiteTitle ? LineBlogFileNameArray.push(_title.toUpperCase()) : '';
        LineBlogFileNameArray.push(username);
        prefBlogTitle ? LineBlogFileNameArray.push(lineBlogTabTitle) : '';
        LineBlogFileNameArray.push(_blogId);
        prefIncludeDate ? LineBlogFileNameArray.push(GetDateFormat(prefDateFormatting)) : '';
        LineBlogFileNameArray.push(GenerateRandomString(lbPrefStringGenerator));

        DevMode ? console.log("LineBlogFileNameArray") : false;
        DevMode ? console.log(LineBlogFileNameArray) : false;

        finalFileName = LineBlogFileNameArray.toString();
        finalFileName = LineBlogFileNameArray.join(", ");
        LineBlogContentJS.FileName = finalFileName.replace(/,/g, '').replace(/ /g, "-").toString() + ".jpg";
        
        StartDownload(Website.LINE_BLOG, LineBlogContentJS.FinalURL, LineBlogContentJS.FileName);

        // Clear array when finished
        while (LineBlogFileNameArray.length > 0){
            DevMode ? console.log("Clearing LineBlogFileNameArray... " + LineBlogFileNameArray) : false;
            LineBlogFileNameArray.pop();
        }

        if (DevMode){
            if (LineBlogFileNameArray.length == 0){
                console.log("LineBlogFileNameArray Array Cleared!");
            }
        }

    });
}