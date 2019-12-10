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

function LineBlogURL(imageURL, currentUrl) {
    console.log("LineBlogURL (imageURL)", imageURL);
    console.log("LineBlogURL (currentUrl)", currentUrl);
    lineBlogCurrentUrl = currentUrl;

    const currentUrlSplit = lineBlogCurrentUrl.split("/");
    const blogId = currentUrlSplit[4];

    if (blogId == ""){
        alert("You must click on the blog post to save this image");
    }

    LINEBlogImageURL(imageURL);
}

let finalLineBlogURL = null;

function LINEBlogImageURL(url) {
    console.log("LINEBlogImageURL", url);
    const originalUrl = url;
    const getOriginalSize = originalUrl.substring(0, originalUrl.lastIndexOf("/") + 0);
    LineBlogContentJS.FinalURL = getOriginalSize;

    LINEBlogFileBuilder();
}

function LINEBlogFileBuilder(){

    const currentUrlSplit = lineBlogCurrentUrl.split("/");
    const title = currentUrlSplit[2];
    const username = currentUrlSplit[3];
    const blogId = currentUrlSplit[5];

    const _title = title.replace(".me", "");
    const _blogId = blogId.replace(".html", "");

    console.log("LINEBlogFileBuilder " + title + " " + username + " " + blogId);

    LineBlogContentJS.FileName = _title + " " + username + " " + _blogId + " " + GenerateRandomString(4) + ".jpg";
    StartDownload();
}

function StartDownload(){
    FileDownloadManager(Website.LINE_BLOG);
}