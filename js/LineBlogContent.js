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

/** Load LINE BLOG Preferences */

/** For reference in saveImageEvent.js */
let LineBlogContentJS = {
    FinalURL: null,
    FileName: null
}

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

    const title = SplitURL(lineBlogCurrentUrl, 2);
    const username = SplitURL(lineBlogCurrentUrl, 3);
    const blogId = SplitURL(lineBlogCurrentUrl, 5);

    const _title = title.replace(".me", "");
    const _blogId = blogId.replace(".html", "");

    console.log("LINEBlogFileBuilder " + title + " " + username + " " + blogId);

    LineBlogContentJS.FileName = _title + " " + username + " " + lineBlogTabTitle + " " + _blogId + " " + GenerateRandomString(4) + ".jpg";
    StartDownload();
}

function StartDownload(){
    FileDownloadManager(Website.LINE_BLOG);
}