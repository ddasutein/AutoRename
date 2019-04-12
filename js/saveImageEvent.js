var contextMenuItem = {
    "id": "saveImage",
    "title": "Save image (Auto Rename)",
    "contexts": ["image"],
};

chrome.contextMenus.create(contextMenuItem);

function getRandomStrings(length) {
    const value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const random = [];
    for (let i = 0; i < length; i++) {
        random.push(value[Math.floor(Math.random() * value.length)]);
    }
    return random.join('');
}

const __randomStringLength = 8;
var __extJPEG = ".jpeg";
var __extPNG = ".png"

chrome.contextMenus.onClicked.addListener(function(info, tab){

    var tweetUrl = tab.url;
    var tweetUrlSplit = tweetUrl.split('/');
    var twitterWebsite = tweetUrlSplit[2];
    var twitterUsername = tweetUrlSplit[3];
    var tweetId = tweetUrlSplit[5];

    if (twitterWebsite !== "twitter.com"){
        alert("Sorry, this extension only supports Twitter at this time.");
        return;
    }

    if (tweetId == null){
        alert("Click on the tweet to use this extension.");
        return;
    }
    else {
        chrome.downloads.download({
            url: info.srcUrl,
            filename: "@" + twitterUsername + " [" + tweetId + "]" + "[" + getRandomStrings(__randomStringLength) + "]" + __extJPEG,
            saveAs: true
        })
    }

});