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

    Parameters: (() => WebsiteConfigObject.filter((x => x.uri == Website.Bluesky))[0]),

    
    SaveMedia: ((data, contextMenuSelectedId) => {

        let TARGET_URL = Bluesky.ViewOriginalImage(data, false);
        console.log(`TARGET URL >> ${TARGET_URL}`);

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

        BKSY = Bluesky.Parameters();

        FILE_NAME_FORMAT = BKSY.file_name;
        FILE_NAME_FORMAT = FILE_NAME_FORMAT.split("-");

        let bksyFileNameObj = {
            "website_title": BKSY.name,
            "bsky_username": Bluesky.GetUsername(data.tab_url),
            "bsky_post_id": Bluesky.GetPostID(data.tab_url)
        }

        FILE_NAME_FORMAT = FILE_NAME_FORMAT.map((FNF)=>{
            let hasReplacedValue = false;
            for (let BFN in bksyFileNameObj){
                if (FNF == `{${BFN}}`) {
                    FNF = FNF.replace(`{${BFN}}`, bksyFileNameObj[BFN]);
                    hasReplacedValue = true;
                    break;
                }
            }
            return hasReplacedValue ? FNF : null;
        }).filter((x => x != null)).join("-");

        const ImageFormat = DetermineImageFormat(data.info_url);
        FILE_NAME = `${FILE_NAME_FORMAT}.${ImageFormat}`;

        console.log(FILE_NAME);
        
        
        console.log(ImageFormat);
        console.log("==BSKY==")
        console.log(data);
        console.log(contextMenuSelectedId)

        let BlueskyProp = []

        switch (contextMenuSelectedId){
            case ContextMenuID.SaveImage:
                BlueskyProp.push({
                    filename: FILE_NAME,
                    filename_display: FILE_NAME,
                    url: TARGET_URL,
                    website: "Bluesky",
        
                });
                DownloadManager.StartDownload(BlueskyProp);
                break;
            case ContextMenuID.ViewOriginalImage:
                Bluesky.ViewOriginalImage(data, true);
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