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

function SaveLINEBlogMediaV2(tabUrl, url){

    if (BrowserTabInfo.URL.match(Website.LINE_BLOG)){
        lineblogTitle = BrowserTabInfo.Title.split("-")[1].trim().toString();
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
        temp = `LINE BLOG-${fileNameObj.username}-${fileNameObj.blogtitle}-{date}-{string}`;
        temp = temp.split("-");
        console.log(temp);

        Object.values(SettingsArray.filter((key)=>{
            return key.category == CategoryEnum.LINE_BLOG
        }).map((key, index)=>{
            switch (index) {

                // lbPrefIncludeWebsiteTitle
                case 0:
                    if (!key.value){
                        idx = temp.indexOf("LINE BLOG");
                        if (idx > -1){
                            temp.splice(idx, 1)
                        }
                    }
                    break;

                case 1:
                    if (!key.value){
                        idx = temp.indexOf(fileNameObj.blogtitle);
                        if (idx > -1){
                            temp.splice(idx, 1);
                        }
                    }
                    break;

                case 2: 
                    if (!key.value){
                        isUsingDateFormat = false;
                        idx = temp.indexOf("{date}");
                        if (idx > -1){
                            temp.splice(idx, 1);
                        }
                    } else {
                        isUsingDateFormat = true;
                    }
                    break;

                case 3:
                    if (isUsingDateFormat){
                        temp[temp.indexOf("{date}")] = GetDateFormat(key.value);
                    }
                    break;

                case 4:
                    temp[temp.indexOf("{string}")] = Utility.GenerateRandomStringerateRandomString(key.value);
                    break;
                

            }

        }));
        console.log(temp)
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

    StartDownloadV2(lineBlogImageFile);

}