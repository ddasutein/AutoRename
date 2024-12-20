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

const Threads = {

    Settings: (()=>{
        return Settings.Load().Threads.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {})
    }),

    SaveMedia: ((data, contextMenuSelectedId) => {

        let urlObj = {
            info_url: data.info_url,
            link_url: data.link_url,
            tab_url: data.tab_url
        }
        console.log("enter func")
        const getImageFormat = function (mediaLink) {

            const imageFormats = [".jpg", ".jpeg", ".png", ".webp"];
            let mLink = mediaLink.info_url;
            mLink = mLink.split("?")[0];
            let src;
            if (imageFormats.some(x => (mLink).includes(x))) {
                src = mLink.split("/")[5];
                src = src.substring(src.lastIndexOf("."));
                return src;
            }
        }

        const BuildThreadsFileName = ((threadsSettings, urlObj, include_prefix)=>{

            let GlobalSettings = Settings.Load().General.map((data)=>{
                return {
                    "key": data.key,
                    "value": data.value
                }
            }).reduce((obj, data)=>{
                obj[data.key] = data;
                return obj;
            }, {});

            ThreadsAttributes = WebsiteConfigObject.filter((x => x.uri == "threads.net"))[0];
            let temp = ThreadsAttributes.file_name;
            let user;
            temp = temp.split("-");

            threadsSettings["threadsIncludeWebsiteTitle"].value ?  temp[temp.indexOf("{website_title}")] = "Threads" : Utility.RemoveUnusedParameter(temp, "{website_title}")
            user = urlObj.tab_url.split("/")[3];
            temp[temp.indexOf("{attrib1}")] = user;

            if (threadsSettings["threadsIncludeDate"].value){
                let prefObj = {};

                if (GlobalSettings["global_prefer_locale_format"].value){
                    prefObj["prefer_locale_format"] = true;
                    const timedateValue = getTimeDate(prefObj);
                    temp[temp.indexOf("{date}")] = timedateValue
                } else {
                    prefObj["prefer_locale_format"] = false;

                    if (GlobalSettings["global_date_format"].value == "custom"){
                        prefObj["date_format"] = GlobalSettings["global_custom_date_format"].value;
                    } else {
                        prefObj["date_format"] = GetDateFormat(GlobalSettings["global_date_format"].value);
                    }
                    const timedateValue = getTimeDate(prefObj);
                    temp[temp.indexOf("{date}")] = timedateValue;
                }
            } else {
                Utility.RemoveUnusedParameter(temp, "{date}");
            }

            include_prefix == true ? temp[temp.indexOf("{prefix}")] = threadsSettings["threadsCustomPrefix"].value : Utility.RemoveUnusedParameter(temp, "{prefix}");
            
            if (include_prefix){
                threadsSettings["threadsCustomPrefix"].value == "" ? Utility.RemoveUnusedParameter(temp, "{prefix}") : temp[temp.indexOf("{prefix}")] = threadsSettings["threadsCustomPrefix"].value;

            } else {
                Utility.RemoveUnusedParameter(temp, "{prefix}");
            }

            if (urlObj.tab_url.includes("post")){
                temp[temp.indexOf("{attrib2}")] = urlObj.tab_url.split("/")[5];
            } else {
                Utility.RemoveUnusedParameter(temp, "{attrib2}");
            }

            temp[temp.indexOf("{randomstring}")] = Utility.GenerateRandomString(threadsSettings["threadsRandomStringLength"].value);
            
            Object.freeze(temp);

            let finalFilePath;

            if (threadsSettings["threadsSaveImageToFolderBasedOnUsername"].value == true){
                finalFilePath = `${user}/${temp.toString().replace(/,/g, "-")}`;
            } else {
                finalFilePath = `${temp.toString().replace(/,/g, "-")}`;
            }

            return {
                filename_path: finalFilePath + getImageFormat(urlObj),
                filename_display: temp.toString().replace(/,/g, "-"),
                title: ThreadsAttributes.name
            }

        });

        let threadsFileProp = [];

        console.log(contextMenuSelectedId)
        switch (contextMenuSelectedId) {
            case ContextMenuID.SaveImage:
                fl = BuildThreadsFileName(Threads.Settings(), urlObj, false);
                console.log(fl);
                threadsFileProp.push({
                    filename: fl.filename_path,
                    filename_display: fl.filename_display,
                    url: urlObj.info_url,
                    website: fl.title,

                });
                DownloadManager.StartDownload(threadsFileProp);
                break;

            case ContextMenuID.SaveImageWithPrefix:
                fl = BuildThreadsFileName(Threads.Settings(), urlObj, true);
                threadsFileProp.push({
                    filename: fl.filename_path,
                    filename_display: fl.filename_display,
                    url: urlObj.info_url,
                    website: fl.title,

                });
                DownloadManager.StartDownload(threadsFileProp);
                break;

            case ContextMenuID.AddDownloadQueue:
                fl = BuildThreadsFileName(Threads.Settings(), urlObj, false);
                threadsFileProp.push({
                    filename: fl.filename_path,
                    filename_display: fl.filename_display,
                    url: urlObj.info_url,
                    website: fl.title,

                });
                DownloadManager.AddDownloadQueue(threadsFileProp);
                break;

        }
    })


}