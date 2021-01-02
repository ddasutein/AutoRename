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

function SaveRedditMedia(tabUrl, url, linkUrl, mode) {

   function getSubredditName(tabUrl) {

      let subRedditName = "";
      subRedditName = SplitURL(tabUrl, 4);
      return subRedditName;

   }

   function getRedditImageFormat(url) {
      return url.split(".")[3];
   }

   let subredditName = "";
   let redditPostSource = "";
   let redditThreadTitle = "";
   let redditThreadId = "";

   let fileName;
   let fileNameBuilderArray = [];
   let redditUrl = SplitURL(linkUrl, 5);

   let redditMediaSrc = url;
   //console.log(redditUrl);

   switch (mode) {

      case RedditMode.Full_View:

         subredditName = SplitURL(tabUrl, 4);
         redditThreadId = SplitURL(tabUrl, 6);
         redditThreadTitle = SplitURL(tabUrl, 7);

         console.log(redditThreadTitle)

         if (redditMediaSrc.includes("preview.redd.it")) {
            redditMediaSrc = redditMediaSrc.replace(/preview.redd.it/g, "i.redd.it");
            redditMediaSrc = redditMediaSrc.split("?")[0];
         }

         let redditSettings = GetSettings.Reddit();

         IncludeWebsiteTitlePrefix = ((bool) => bool ? fileNameBuilderArray.push("[Reddit] r") : fileNameBuilderArray.push("r"));
         IncludeSubredditPostTitle = ((bool) => bool ? fileNameBuilderArray.push(decodeURI(redditThreadTitle)) : false);

         redditSettings.map((key, index) => {

            /**
             * To get index number, set DevMode to true in /js/Common/Debugger.js
             * Then open the browser console and type >> Debug.Settings("reddit")
             */

            switch (index) {
               case 0:
                  IncludeWebsiteTitlePrefix(key.value);
                  break;
               case 1:
                  fileNameBuilderArray.push(subredditName);
                  fileNameBuilderArray.push(redditThreadId);
                  IncludeSubredditPostTitle(key.value);
                  break;

               case 2:
                  fileNameBuilderArray.push(GenerateRandomString(key.value));
                  break;
            }
         });


         break;

      case RedditMode.Half_View:
         
         if (!!redditUrl) {
            subredditName = SplitURL(linkUrl, 4);
            redditThreadId = SplitURL(linkUrl, 6);
            redditThreadTitle = SplitURL(linkUrl, 7);
            console.log(redditThreadTitle)

            console.log("Yes i am valid");

            if (redditMediaSrc.includes("preview.redd.it")) {
               redditMediaSrc = redditMediaSrc.replace(/preview.redd.it/g, "i.redd.it");
               redditMediaSrc = redditMediaSrc.split("?")[0];
            }

            let redditSettings = GetSettings.Reddit();

            IncludeWebsiteTitlePrefix = ((bool) => bool ? fileNameBuilderArray.push("[Reddit] r") : fileNameBuilderArray.push("r"));
            IncludeSubredditPostTitle = ((bool) => bool ? fileNameBuilderArray.push(decodeURI(redditThreadTitle)) : false);

           
            redditSettings.map((key, index) => {

               /**
                * To get index number, set DevMode to true in /js/Common/Debugger.js
                * Then open the browser console and type >> Debug.Settings("reddit")
                */

               switch (index) {
                  case 0:
                     IncludeWebsiteTitlePrefix(key.value);
                     break;
                  case 1:
                     fileNameBuilderArray.push(subredditName);
                     fileNameBuilderArray.push(redditThreadId);
                     IncludeSubredditPostTitle(key.value);
                     break;

                  case 2:
                     fileNameBuilderArray.push(GenerateRandomString(key.value));
                     break;
               }

            });

         }

         break;

   }
   // fileNameBuilderArray.push(redditThreadId);

   fileName = fileNameBuilderArray.toString();
   fileName = fileNameBuilderArray.join(", ");
   fileName = fileName.replace(/, /g, "-") + "." + getRedditImageFormat(redditMediaSrc);
   console.log(fileNameBuilderArray);
   console.log(fileName);
   console.log(redditMediaSrc);

   StartDownload(Website.Reddit, redditMediaSrc, fileName);

   do {
      DevMode ? console.log("Clearing fileNameBuilderArray... " + fileNameBuilderArray) : false;
      fileNameBuilderArray.pop();
      if (DevMode) {
         if (fileNameBuilderArray.length == 0) {
            console.log("Done!");
         }
      }
   }
   while (fileNameBuilderArray.length != 0)

   console.log(`SaveRedditMedia :: ${tabUrl} and ${url} -- ${linkUrl}`);

}