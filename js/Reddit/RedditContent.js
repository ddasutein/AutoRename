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

const Reddit = {

   InfoUrl: null,
   TabUrl: null,
   LinkUrl: null,

   Parameters: (() => WebsiteConfigObject.filter((x => (x.uri).includes(Website.Reddit)))[0]),

   GetSubredditTitle: ((urlObj)=>{
      return Utility.SplitURL(Reddit.TabUrl, 4);
   }),

   GetPostTitle: ((urlObj)=>{
      return Utility.SplitURL(Reddit.TabUrl, 7);
   }),

   GetPostId: ((urlObj)=>{
      return Utility.SplitURL(Reddit.TabUrl, 6);
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

   GetMediaProperties: (() => {
      const imageFormats = [".jpg", ".jpeg", ".png", ".webp"];
      let mLink = Reddit.InfoUrl;
      let src;
      if (imageFormats.some(x => (mLink).includes(x))){
         src = mLink.split("/")[3];
         src = src.substring(0, src.indexOf("?"));

         mediaId        = src.substring(0, src.indexOf("."));
         imageFormat   = src.substring(src.indexOf("."))
         
         return {
            media_id: mediaId,
            image_format: imageFormat
         }
      }
   }),

   SaveMedia: ((data, contextMenuSelectedId)=>{

      Reddit.InfoUrl          = data.info_url;
      Reddit.TabUrl           = data.tab_url;
      Reddit.LinkUrl          = data.link_url;
      const RedditParams      = Reddit.Parameters();
      const RedditName        = RedditParams.name;
      const RedditSettings    = Reddit.Settings();
      const RedditSubreddit   = Reddit.GetSubredditTitle();
      const RedditPostTitle   = Reddit.GetPostTitle();
      const RedditPostId      = Reddit.GetPostId();
      const RedditMedia       = Reddit.GetMediaProperties();
      const DateUtils         = Utility.DateUtils();
      const CurrentTime       = DateUtils.GetCurrentTime();
      const CurrentFormat     = DateUtils.GetUserFormat();

      const RedditObj = {};
      RedditSettings["redditIncludeWebsite"].value ? RedditObj["website_title"] = RedditName : null;
      RedditObj["subreddit"] = RedditSubreddit;
      RedditObj["post_title"] = RedditPostTitle;
      RedditSettings["redditIncludePostID"].value ? RedditObj["post_id"] = RedditPostId : null;
      RedditSettings["redditIncludeDate"].value ? RedditObj["date"] = DateUtils.SetupDateFormat({
          inputDate: CurrentTime,
          preferLocaleFormat: false,
          dateFormat: CurrentFormat
      }) : null ;
      RedditObj["randomstring"] = Utility.GenerateRandomString(RedditSettings["redditStringGenerator"].value);
      contextMenuSelectedId == ContextMenuID.SaveImageWithPrefix ? RedditObj["prefix"] = RedditSettings["redditCustomPrefix"].value : null;

      FILE_NAME_FORMAT = RedditParams.file_name;
      FILE_NAME_FORMAT = FILE_NAME_FORMAT.split("-");
      FILE_NAME_FORMAT = FILE_NAME_FORMAT.map((FNF)=>{
          let hasReplacedValue = false;
          for (let BFN in RedditObj){
              if (FNF == `{${BFN}}`) {
                  FNF = FNF.replace(`{${BFN}}`, RedditObj[BFN]);
                  hasReplacedValue = true;
                  break;
              }
          }
          return hasReplacedValue ? FNF : null;
      }).filter((x => x != null)).join("-");

      let filename = `${FILE_NAME_FORMAT}${RedditMedia.image_format}`;
      let fileNameDisplay = FILE_NAME_FORMAT;
      
      let redditImageFile = [
         {
            filename: filename,
            filename_display: fileNameDisplay,
            url: Reddit.InfoUrl,
            website: RedditName
         }
      ];
      
      switch (contextMenuSelectedId){
         case ContextMenuID.SaveImage:
            case ContextMenuID.SaveImageWithPrefix:
            DownloadManager.StartDownload(redditImageFile);
            break;

         case ContextMenuID.AddDownloadQueue:
            DownloadManager.AddDownloadQueue(redditImageFile);
            break;
      }

   })

}