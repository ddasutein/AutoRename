let contextMenuItem = {
    "id": "saveImage",
    "title": "Save image as (AutoRename)",
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

let _fileName = {
    username: "",
    tweetId: "",
    randomString: "",
    fileExtension: ".jpg"
};

function fileName() {
    const username = _fileName.username;
    const tweetid = _fileName.tweetId;
    const randomString = _fileName.randomString;
    const fileExtension = _fileName.fileExtension;
    let finalFileName = "";

    if (tweetid === "") {
        finalFileName = username + "-" + randomString + fileExtension;
    } else {
        finalFileName = username + "-" + tweetid + "-" + randomString + fileExtension;
    }
    return finalFileName;
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let currentUrl = tab.url;
    let currentUrlSplit = currentUrl.split('/');
    let currentWebsite = currentUrlSplit[2];

    // options.html and options.js
    chrome.storage.local.get({
        fileNameStringLength: '8',
        showMentionSymbol: true,
        showTweetId: true
    }, function (items) {

        switch (currentWebsite) {
            case "twitter.com":
                const twitterUsername = currentUrlSplit[3];
                const tweetId = currentUrlSplit[5];

                if (!items.showMentionSymbol) {
                    _fileName.username = twitterUsername;
                } else {
                    _fileName.username = "@" + twitterUsername;
                }

                if (!items.showTweetId) {
                    _fileName.tweetId = "";
                } else {
                    _fileName.tweetId = tweetId;
                }

                _fileName.randomString = generateRandomString(items.fileNameStringLength);

                if (tweetId == null) {
                    alert("Click on the tweet to use this extension.");
                    return;
                } else {
                    chrome.downloads.download({
                        url: info.srcUrl,
                        filename: fileName(),
                        saveAs: true
                    })
                }
                break;
            default:
                alert("Sorry, this extension only supports Twitter at this time. For a list of supported websites, visit my Github repository: https://github.com/ddasutein/AutoRename");
        }
    });
});