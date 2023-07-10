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

var Threads = {

    SaveMedia: ((data, contextMenuSelectedId) => {

        let urlObj = {
            info_url: data.info_url,
            link_url: data.link_url,
            tab_url: data.tab_url
        }


        const getImageFormat = function (mediaLink) {

            const imageFormats = [".jpg", ".jpeg", ".png", ".webp"];
            let mLink = mediaLink.info_url;
            mLink = mLink.split("?")[0];
            let src;
            if (imageFormats.some(x => (mLink).includes(x))) {
                src = mLink.split("/")[5];
                console.log(src.lastIndexOf("."))
                src = src.substring(src.lastIndexOf("."));
                return src;
            }
        }
        console.log(getImageFormat(urlObj))
        console.log(urlObj)
        filename = Utility.SplitURL(urlObj.tab_url, 4);
        console.log(filename)
        fileNameDisplay = filename;

        let threadsFileProp = [];

        switch (contextMenuSelectedId) {
            case contextMenuId.saveImage:
                threadsFileProp.push({
                    filename: filename + getImageFormat(urlObj),
                    filename_display: fileNameDisplay,
                    url: urlObj.info_url,
                    website: "Threads",

                });
                DownloadManager.StartDownload(threadsFileProp);
                break;

            case contextMenuId.saveImageWithCustomPrefix:
                threadsFileProp.push({
                    filename: filename + getImageFormat(urlObj),
                    filename_display: fileNameDisplay,
                    url: urlObj.info_url,
                    website: "Threads",

                });
                DownloadManager.StartDownload(threadsFileProp);
                break;

            case contextMenuId.addDownloadQueue:
                threadsFileProp.push({
                    filename: filename + getImageFormat(urlObj),
                    filename_display: fileNameDisplay,
                    url: urlObj.info_url,
                    website: "Threads",

                });
                DownloadManager.AddDownloadQueue(threadsFileProp);
                break;

        }
    })


}