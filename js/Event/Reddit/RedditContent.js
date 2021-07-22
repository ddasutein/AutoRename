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

function SaveRedditMedia(tabUrl, url, linkUrl, mode) {

   function getRedditImageFormat(mediaLink) {
      console.log("url test", mediaLink)
      if (mediaLink.includes("i.redd.it")){
         return "." + mediaLink.split(".")[3]
      }
   }
   
   function buildFileName(filenameObj) {
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

   switch (mode) {

      case RedditMode.Full_View:

         fileNameObj["subredditName"] = Utility.SplitURL(tabUrl, 4);
         fileNameObj["redditPostId"] = Utility.SplitURL(tabUrl, 6);
         fileNameObj["redditPostTitle"] = Utility.SplitURL(tabUrl, 7);
         redditPostSrc = linkUrl;
         redditImageFile.push({
            filename: buildFileName(fileNameObj) + getRedditImageFormat(linkUrl),
            url: redditPostSrc
         });
         break;

      case RedditMode.Half_View:
         break;

   }

   StartDownloadV2(redditImageFile)

}