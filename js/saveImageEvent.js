let contextMenuItem = {
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

let __extJPEG = ".jpg";
let __extPNG = ".png";

chrome.contextMenus.onClicked.addListener(function (info, tab) {

    // options.html and options.js
    chrome.storage.local.get({
        fileNameStringLength: '8',
        showMentionSymbol: true,
        showTweetId: true
    }, function (items) {

        let _fileName = "";
        let currentUrl = tab.url;
        let currentUrlSplit = currentUrl.split('/');
        let currentWebsite = currentUrlSplit[2];

        switch (currentWebsite) {
            case "twitter.com":

                let twitterUsername = currentUrlSplit[3];
                let tweetId = currentUrlSplit[5];

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
                if (!items.showTweetId && !items.showMentionSymbol) {
                    _fileName = generateRandomString(items.fileNameStringLength) + __extJPEG;
                }

                if (tweetId == null) {
                    alert("Click on the tweet to use this extension.");
                    return;
                } else {
                    chrome.downloads.download({
                        url: info.srcUrl,
                        filename: _fileName,
                        saveAs: true
                    })
                }
                break;
            default:
                alert("Sorry, this extension only supports Twitter at this time.");
        }
    });
});