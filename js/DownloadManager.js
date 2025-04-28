/** MIT License
 * 
 * Copyright (c) 2025 Dasutein
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

var DownloadManager = {

    AddToRecentDownloads: (( {
        title,
        file_name,
        file_extension,
        website,
        url,
        media_url
    } ) => {
        generalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        let recentItemsArray = generalSettings["global_download_history_data"].value;
        if (recentItemsArray.length > 0) {
            recentItemsArray = JSON.parse(recentItemsArray)
        } else {
            recentItemsArray = [];
        }
        const MAX_LIMIT = 21;

        const DateUtils         = Utility.DateUtils();
        const CurrentTime       = DateUtils.GetCurrentTime();

        const recentItemObj = {
            "title": null,
            "file_name": null,
            "website": null,
            "created_time": null,
            "file_size": null,
            "file_extension": null,
            "url": null,
            "media_url": null
        }
        recentItemObj["id"] = Utility.GenerateRandomString(6);
        recentItemObj["title"] = title;
        recentItemObj["file_name"] = file_name;
        recentItemObj["file_extension"] = file_extension;
        recentItemObj["website"] = website;
        recentItemObj["url"] = url;
        recentItemObj["media_url"] = media_url;
        recentItemObj["created_time"] = DateUtils.SetupDateFormat({
            inputDate: CurrentTime,
            preferLocaleFormat: false,
            dateFormat: "X" // Unix time
        });
        recentItemsArray.unshift(recentItemObj);

        if (recentItemsArray.length >= MAX_LIMIT){
            recentItemsArray.pop();
        }

        Settings.Save("global_download_history_data", JSON.stringify(recentItemsArray));
    }),

    UpdateBadge: (async ()=>{
        generalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        let downloadData = generalSettings["global_download_queue_data"].value;
        if (downloadData.length > 0) {
            downloadData = JSON.parse(downloadData)
        } else {
            downloadData = [];
        }

        Utility.SetBadgeText(downloadData.length);
    }),

    AddDownloadQueue: ((data) => {

        generalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        let downloadData = generalSettings["global_download_queue_data"].value;
        if (downloadData.length > 0) {
            downloadData = JSON.parse(downloadData)
        } else {
            downloadData = [];
        }

        data.forEach((x) => {
            downloadData.push({
                filename: x.filename,
                filename_display: x.filename_display,
                url: x.url,
                website: x.website
            });
        });

        Utility.SetBadgeText(downloadData.length);
        Settings.Save("global_download_queue_data", JSON.stringify(downloadData));

    }),

    ClearDownloadQueue: (() => {
        Settings.Save("global_download_queue_data", "");
        Utility.SetBadgeText(null);
    }),

    StartDownload: ((data) => {

        let fileData = {};

        generalSettings = Settings.Load().General.map((data) => {
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data) => {
            obj[data.key] = data;
            return obj;
        }, {});

        data.forEach((x) => {

            let fileName;
            if (generalSettings["global_use_autorename_folder"].value){
                fileName = `${chrome.runtime.getManifest().name}/${x.website}/${x.filename}`;
            } else {
                fileName = x.filename;
            }

            chrome.downloads.download({
                url: x.url,
                filename: fileName,
                saveAs: generalSettings["global_enable_save_as_window"].value
            }, ((id) => {

                chrome.downloads.onChanged.addListener((delta) => {

                    if (id == delta.id) {

                        if (delta.state && delta.state.current == "in_progress") {
                            fileData["size"] = delta.fileSize.current;
                            fileData["url"] = delta.url.current;
                            fileData["id"] = delta.id;
                            fileData["name"] = x.filename;
                        }

                        if (delta.state && delta.state.current == "complete") {
                            generalSettings["global_show_download_folder"].value ? chrome.downloads.showDefaultFolder() : null;
                            tmp = [];
                            tmp.push(fileData);
                            Settings.Save("global_download_history_data", JSON.stringify(tmp));
                            DownloadManager.UpdateBadge();

                            DownloadManager.AddToRecentDownloads({
                                "title": x.title,
                                "file_name": x.filename_display,
                                "file_size": fileData.size,
                                "url": x.tab_url,
                                "media_url": x.url,
                                "website": x.website
                            });
                        }
                    }
                });

            }));
        });
    }),

}

