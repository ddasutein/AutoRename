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

function SaveRedditMedia(tabUrl, url, linkUrl) {

   function getRedditImageFormat(mediaLink) {
      console.log("url test", mediaLink)
      if (mediaLink.includes("i.redd.it")) {
         return "." + mediaLink.split(".")[3]
      } else if (mediaLink.includes("preview.redd.it")){
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
      temp = `Reddit-${fileNameObj.subredditName.replace(/-/g, "_")}-${fileNameObj.redditPostId}-${fileNameObj.redditPostTitle.replace(/-/g, "_")}-{string}`;
      temp = temp.split("-");

      Object.values(SettingsArray.filter((key) => {
         return key.category == CategoryEnum.Reddit;
      }).map((key, index) => {
         switch (index) {
            case 0:
               if (!key.value) {
                  idx = temp.indexOf("Reddit");
                  if (idx > -1) {
                     temp.splice(idx, 1);
                  }
               }
               break;
            case 1:
               if (!key.value) {
                  idx = temp.indexOf(fileNameObj.redditPostTitle);
                  if (idx > -1) {
                     temp.splice(idx, 1);
                  }
               }
               break;
            case 2:
               if (!key.value) {
                  idx = temp.indexOf(fileNameObj.subredditName);
                  if (idx > -1) {
                     temp.splice(idx, 1);
                  }
               }
               break;
            case 3:
               break;
            case 4:
               temp[temp.indexOf("{string}")] = Utility.GenerateRandomString(key.value);
               break;
         }
      }));

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
         if (linkUrl == undefined){
            alert(chrome.i18n.getMessage("error_reddit_gallery_post"));
            return;
         }
         
         // If user is on classic reddit then show message
         if (linkUrl.includes("i.redd.it")){
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