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

var DownloadManager = {

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
            chrome.downloads.download({
                url: x.url,
                filename: `${x.filename}`,
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
                        }
                    }
                });

            }));
        });
    }),

}

