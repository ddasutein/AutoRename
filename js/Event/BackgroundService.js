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

const Backgroundscripts = [
    "/js/Configuration/Settings.js",
    "/js/Configuration/Runtime.js",
    "/lib/Moment/moment.js",
    "/lib/Moment/moment-with-locales.js",
    "/js/Common/Utility.js",
    "/js/Common/Debugger.js",
    "/js/Common/SetTimeDate.js",
    "/js/Event/Twitter/TwitterContent.js",
    "/js/Event/LINE BLOG/LineBlogContent.js",
    "/js/Event/Reddit/RedditContent.js",
    "/js/Event/DownloadManager.js",
    "/js/Event/SaveAsEventHandle.js"
]

try {
    Backgroundscripts.forEach((x)=>{
        importScripts(x);
    });

}catch(e){
    console.error(e);
}