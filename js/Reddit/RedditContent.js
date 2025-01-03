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

const Reddit = {

   GetSubredditTitle: ((urlObj)=>{
      return Utility.SplitURL(urlObj.tab_url, 4);
   }),

   GetPostTitle: ((urlObj)=>{
      return Utility.SplitURL(urlObj.tab_url, 7);
   }),

   GetPostId: ((urlObj)=>{
      return Utility.SplitURL(urlObj.tab_url, 6);
   }),

   Settings: (()=>{
      return Settings.Load().Reddit.map((data) => {
         return {
            "key": data.key,
            "value": data.value
         }
      }).reduce((obj, data) => {
         obj[data.key] = data;
         return obj;
      }, {});
   }),

   SaveMedia: ((data, contextMenuSelectedId)=>{

      let urlObj = {
         info_url: data.info_url,
         link_url: data.link_url,
         tab_url: data.tab_url
      }

      const getRedditMedia = function (mediaLink) {

         const imageFormats = [".jpg", ".jpeg", ".png", ".webp"];
         let mLink = mediaLink.info_url;
         let src;
         if (imageFormats.some(x => (mLink).includes(x))){
            src = mLink.split("/")[3];
            src = src.substring(0, src.indexOf("?"));

            mediaId        = src.substring(0, src.indexOf("."));
            imageFormat   = src.substring(src.indexOf("."))

            AutoRename.SetLogLevel == AutoRename.LogLevel.DEBUG ? console.log(`Reddit >> Media ID ${mediaId} : Image Format ${imageFormat}`) : "";

            return {
               media_id: mediaId,
               image_format: imageFormat
            }
         }
      }

      const BuildRedditFileName = function(redditSettings, urlObj, include_prefix){

         
         let GlobalSettings = Settings.Load().General.map((data)=>{
            return {
                "key": data.key,
                "value": data.value
            }
        }).reduce((obj, data)=>{
            obj[data.key] = data;
            return obj;
        }, {});

         let temp = `{prefix}-{website_title}-{subreddit_name}-{subreddit_post_id}-{date}-{string}`;
         temp = temp.split("-");

         if (redditSettings["redditIncludeDate"].value){
            let prefObj = {};

            if (GlobalSettings["global_prefer_locale_format"].value == true) {
               prefObj["prefer_locale_format"] = true;
               const timedateValue = getTimeDate(prefObj);
               temp[temp.indexOf("{date}")] = timedateValue;
            } else {

               prefObj["prefer_locale_format"] = false;

               if (GlobalSettings["global_date_format"].value == "custom") {
                  prefObj["date_format"] = GlobalSettings["global_custom_date_format"].value;
               } else {
                  prefObj["date_format"] = GetDateFormat(GlobalSettings["global_date_format"].value);
               }

               const timedateValue = getTimeDate(prefObj)
               temp[temp.indexOf("{date}")] = timedateValue;

            }

         } else {
            Utility.RemoveUnusedParameter(temp, "{date}");
         }

         temp[temp.indexOf("{subreddit_name}")] = Reddit.GetSubredditTitle(urlObj);
         redditSettings["redditIncludeWebsite"].value ? temp[temp.indexOf("{website_title}")] = "Reddit" : Utility.RemoveUnusedParameter(temp, "{website_title}");
         redditSettings["redditIncludePostID"].value ?  temp[temp.indexOf("{subreddit_post_id}")] = Reddit.GetPostId(urlObj) : Utility.RemoveUnusedParameter(temp, "{subreddit_post_id}");
         redditSettings["redditStringGenerator"].value == "0" ? Utility.RemoveUnusedParameter(temp, "{string}") : temp[temp.indexOf("{string}")] = Utility.GenerateRandomString(redditSettings["redditStringGenerator"].value);

         if (include_prefix){
            redditSettings["redditCustomPrefix"].value == "" ? Utility.RemoveUnusedParameter(temp, "{prefix}") : temp[temp.indexOf("{prefix}")] = redditSettings["redditCustomPrefix"].value;
         } else {
            Utility.RemoveUnusedParameter(temp, "{prefix}");
         }

         return {
            filename_path: temp.toString().replace(/,/g, "-") + getRedditMedia(urlObj).image_format,
            filename_display:  temp.toString().replace(/,/g, "-") + getRedditMedia(urlObj).image_format,
            url: urlObj.info_url
         }
         return 

      }


      // ENTRY POINT
      let redditImageFile = [];

      
      switch (contextMenuSelectedId){
         case ContextMenuID.SaveImage:
            fl = BuildRedditFileName(Reddit.Settings(), urlObj, false);
            console.log(fl);
            redditImageFile.push({
               filename: fl.filename_path,
               filename_display: fl.filename_display,
               url: fl.url,
               website: "Reddit"
            });
            console.log(redditImageFile);
            DownloadManager.StartDownload(redditImageFile);
            break;

         case ContextMenuID.SaveImageWithPrefix:
            fl = BuildRedditFileName(Reddit.Settings(), urlObj, true);
            redditImageFile.push({
               filename: fl.filename_path,
               filename_display: fl.filename_display,
               url: fl.url,
               website: "Reddit"
            });
            DownloadManager.StartDownload(redditImageFile);
            break;

         case ContextMenuID.AddDownloadQueue:
            fl = BuildRedditFileName(Reddit.Settings(), urlObj, false);
            redditImageFile.push({
               filename: fl.filename_path,
               filename_display: fl.filename_display,
               url: fl.url,
               website: "Reddit"
            });
            DownloadManager.AddDownloadQueue(redditImageFile);
            break;
      }

   })

}