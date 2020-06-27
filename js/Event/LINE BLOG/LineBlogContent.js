/** MIT License
 * 
 * Copyright (c) 2020 Dasutein
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

function SaveLINEBLOGMedia(tabUrl, url) {
    let fileName;
    let fileNameBuilderArray = [];
    let lineblogId = "";
    let lineblogUser = SplitURL(tabUrl, 3);
    let lineblogTitle = "";

    try {

        //#region Run validation

        // Validate if the tab is LINE BLOG
        if (BrowserTabInfo.URL.match(Website.LINE_BLOG)) {
            lineblogTitle = BrowserTabInfo.Title.split("-")[1].trim().toString();
        }

        // Validate if there is a blog id
        if (SplitURL(tabUrl, 5) == undefined) {
            alert(chrome.i18n.getMessage("error_lineblog_click_blog"));
        } else {
            lineblogId = SplitURL(tabUrl, 5).toString().replace(".html", "").trim();
        }

        if (lineblogTitle == undefined){
            throw `- ${chrome.i18n.getMessage("error_lineblog_no_title")}`;
        }

        //#endregion

        let lineblogSettings = SettingsArray.filter((key) => {
            return key.category == CategoryEnum.LINE_BLOG;
        });

        IncludeWebsitePrefix = ((bool) => bool ? fileNameBuilderArray.push(`[LINE BLOG] ${lineblogUser}`) : fileNameBuilderArray.push(lineblogUser));
        IncludeBlogTitle = ((bool) => bool ? fileNameBuilderArray.push(lineblogTitle) : false);
        IncludeDate = ((bool, settings) => {
            settings.filter((x) => {
                return x.key === "lbPrefDateFormat";
            }).map((x) => {
                if (bool) {
                    fileNameBuilderArray.push(GetDateFormat(x.value));
                }
            });
        });

        lineblogSettings.map((key, index) => {

            /**
             * To get index number, set DevMode to true in /js/Common/Debugger.js
             * Then open the browser console and type >> Debug.Settings("lineblog")
             */

            switch (index) {
                case 0:
                    IncludeWebsitePrefix(key.value);
                    break;
                case 1:
                    IncludeBlogTitle(key.value);
                    break;
                case 2:
                    IncludeDate(key.value, lineblogSettings);
                    break;
                case 4:
                    fileNameBuilderArray.push((GenerateRandomString(key.value)));
                    break;
            }

        });

        fileName = fileNameBuilderArray.toString();
        fileName = fileNameBuilderArray.join(", ");
        fileName = fileName.replace(/, /g, "-") + ".jpg";
        StartDownload(Website.LINE_BLOG, url, fileName);

        // Clear array when finished
        while (fileNameBuilderArray.length > 0) {
            DevMode ? console.log("Clearing fileNameBuilderArray... " + fileNameBuilderArray) : false;
            fileNameBuilderArray.pop();
            if (DevMode) {
                if (fileNameBuilderArray.length == 0) {
                    console.log("Done!");
                }
            }
        }
    } catch (Exception) {
        alert(`${chrome.i18n.getMessage("error_generic")} \n${Exception.toString().trim()} \n\n${chrome.i18n.getMessage("error_exception_reload")}`);

        chrome.tabs.getSelected(function (tab) {
            chrome.tabs.reload(tab.id);
        });
    }

}