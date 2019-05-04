var contextMenuItem = {
    "id": "saveImage",
    "title": "Save image (AutoRename)",
    "contexts": ["image"],
};

chrome.contextMenus.create(contextMenuItem);

function generateRandomString(length) {
    const value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const random = [];
    for (let i = 0; i < length; i++) {
        random.push(value[Math.floor(Math.random() * value.length)]);
    }
    return random.join('');
}

var __extJPEG = ".jpg";
var __extPNG = ".png";

chrome.contextMenus.onClicked.addListener(function (info, tab) {

    // options.html and options.js
    chrome.storage.local.get({
        fileNameStringLength: '8',
        showMentionSymbol: true,
        showTweetId: true
    }, function (items) {

        var _fileName = "";
        var tweetUrl = tab.url;
        var tweetUrlSplit = tweetUrl.split('/');
        var twitterWebsite = tweetUrlSplit[2];
        var twitterUsername = tweetUrlSplit[3];
        var tweetId = tweetUrlSplit[5];

        if (items.showTweetId === true) {

            if (items.showMentionSymbol === true) {
                _fileName = "@" + twitterUsername + "-" + tweetId + "-" + generateRandomString(items.fileNameStringLength) + __extJPEG;
            } else if (items.showMentionSymbol === false) {
                _fileName = twitterUsername + "-" + tweetId + "-" + generateRandomString(items.fileNameStringLength) + __extJPEG;
            }

        } else if (items.showTweetId === false) {

            if (items.showMentionSymbol === true) {
                _fileName = "@" + twitterUsername + "-" + generateRandomString(items.fileNameStringLength) + __extJPEG;
            } else if (items.showMentionSymbol === false) {
                name = twitterUsername + "-" + generateRandomString(items.fileNameStringLength) + __extJPEG;
            }

        }

        // Just generate a random string if both options are disabled (required)
        if (items.showTweetId === false && items.showMentionSymbol === false) {
            _fileName = generateRandomString(items.fileNameStringLength) + __extJPEG;
        }

        if (twitterWebsite !== "twitter.com") {
            alert("Sorry, this extension only supports Twitter at this time.");
            return;
        }

        if (tweetId == null) {
            alert("Click on the tweet to use this extension.");
            return;
        } else {
            chrome.downloads.download({
                url: info.srcUrl,
                filename: _fileName,
                // filename: "@" + twitterUsername + " [" + tweetId + "]" + "[" + generateRandomString(__randomStringLength) + "]" + __extJPEG,
                saveAs: true
            })
        }
    });
});