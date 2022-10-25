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