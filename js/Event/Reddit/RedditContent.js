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

function SaveRedditMedia(tabUrl, url, linkUrl, customObj) {

   function getRedditImageFormat(mediaLink) {
      console.log("url test", mediaLink)
      if (mediaLink.includes("i.redd.it")) {
         return "." + mediaLink.split(".")[3]
      } else if (mediaLink.includes("preview.redd.it")) {
         mediaLink = mediaLink.substring(0, mediaLink.indexOf("?width"));
         return "." + mediaLink.split(".")[3];
      }
   }

   function convertToFullMediaLink(url) {
      let temp = !!url ? url : "";
      if (temp.includes("preview.redd.it") || temp) {
         temp = temp.replace("preview.redd.it", "i.redd.it")
         temp = temp.substring(0, temp.indexOf("?width"));
      }

      return temp;
   }

   function buildFileName(fileNameObj) {
      let temp;
      let isUsingDateFormat;
      // temp = `Reddit-${fileNameObj.subredditName.replace(/-/g, "_")}-${fileNameObj.redditPostId}-${fileNameObj.redditPostTitle.replace(/-/g, "_")}-{date}-{string}`;

      temp = `{prefix}-{website_title}-{subreddit_name}-{subreddit_post_id}-{post_title}-{date}-{string}`;
      temp = temp.split("-");

      const redditConfig = SettingsArray.filter((key) => {
         return key.category == CategoryEnum.Reddit;
      }).map((data) => {
         return {
            "key": data.key,
            "value": data.value
         }
      }).reduce((obj, data) => {
         obj[data.key] = data;
         return obj;
      }, {});

      if (!redditConfig["redditIncludeWebsite"].value) {
         Utility.RemoveUnusedParameter(temp, "{website_title}");
      } else {
         temp[temp.indexOf("{website_title}")] = "Reddit";
      }

      if (!redditConfig["redditIncludePostID"].value) {
         Utility.RemoveUnusedParameter(temp, "{subreddit_post_id}");
      } else {
         temp[temp.indexOf("{subreddit_post_id}")] = fileNameObj.redditPostId;
      }

      if (!redditConfig["redditStringGenerator"].value == "0") {
         Utility.RemoveUnusedParameter(temp, "{string}");
      } else {
         temp[temp.indexOf("{string}")] = Utility.GenerateRandomString(redditConfig["redditStringGenerator"].value);
      }

      if (!redditConfig["redditIncludeDate"].value) {
         Utility.RemoveUnusedParameter(temp, "{date}");
      } else {
         let prefObj = {};

         if (redditConfig["redditPreferLocaleFormat"].value == true) {
            prefObj["prefer_locale_format"] = true;
            const timedateValue = getTimeDate(prefObj);
            temp[temp.indexOf("{date}")] = timedateValue;
         } else {

            prefObj["prefer_locale_format"] = false;

            if (redditConfig["redditDateFormat"].value == "custom") {
               prefObj["date_format"] = redditConfig["twitter_settings_custom_date_format"].value;
            } else {
               prefObj["date_format"] = GetDateFormat(redditConfig["redditDateFormat"].value);
            }

            const timedateValue = getTimeDate(prefObj)
            temp[temp.indexOf("{date}")] = timedateValue;

         }

      }

      if (customObj.use_prefix == true) {

         if (redditConfig["redditCustomPrefix"].value == "") {
            Utility.RemoveUnusedParameter(temp, "{prefix}");
         } else {
            temp[temp.indexOf("{prefix}")] = redditConfig["redditCustomPrefix"].value;
         }
      } else {
         Utility.RemoveUnusedParameter(temp, "{prefix}");
      }

      temp[temp.indexOf("{subreddit_name}")] = fileNameObj.subredditName;
      temp[temp.indexOf("{post_title}")] = fileNameObj.redditPostTitle.replace(/-/g, "_");


      return temp.toString().replace(/,/g, "-");

   }

   let redditImageFile = [];
   let fileNameObj = {};
   let debugObj = {}
   debugObj["tab"] = tabUrl;
   debugObj["url"] = url;
   debugObj["linkUrl"] = linkUrl;
   console.log(debugObj)

   if (tabUrl.includes("comments")) {
      fileNameObj["subredditName"] = Utility.SplitURL(tabUrl, 4);
      fileNameObj["redditPostId"] = Utility.SplitURL(tabUrl, 6);
      fileNameObj["redditPostTitle"] = Utility.SplitURL(tabUrl, 7);
      redditPostSrc = linkUrl;
      redditImageFile.push({
         filename: buildFileName(fileNameObj) + getRedditImageFormat(linkUrl),
         url: redditPostSrc
      });
   } else {

      // Classic reddit does not return original url for media so this is not supported
      if (url.includes("b.thumbs.redditmedia.com")) {
         alert(chrome.i18n.getMessage("error_reddit_old_half_view"))
         return;
      }

      // New Reddit card view
      if (url.includes("preview.redd.it")) {

         // If this is empty then it is a gallery image post
         if (linkUrl == undefined) {
            alert(chrome.i18n.getMessage("error_reddit_gallery_post"));
            return;
         }

         // If user is on classic reddit then show message
         if (linkUrl.includes("i.redd.it")) {
            alert(chrome.i18n.getMessage("error_reddit_old_half_view"))
            return;
         }
         fileNameObj["subredditName"] = Utility.SplitURL(linkUrl, 4);
         fileNameObj["redditPostId"] = Utility.SplitURL(linkUrl, 6);
         fileNameObj["redditPostTitle"] = Utility.SplitURL(linkUrl, 7);
         redditPostSrc = convertToFullMediaLink(url);
         redditImageFile.push({
            filename: buildFileName(fileNameObj) + getRedditImageFormat(redditPostSrc),
            url: redditPostSrc
         });
      }

   }

   StartDownload(redditImageFile)

}