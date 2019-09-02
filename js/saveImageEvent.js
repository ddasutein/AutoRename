chrome.contextMenus.create({
    "id": "saveImage",
    "title": chrome.i18n.getMessage("context_menu_save_image_as"),
    "contexts": ["image"]
});

// Twitter Specific Context Menu Item
const viewOriginalImageSizeContextMenuItem = chrome.contextMenus.create({
    "id": "viewOriginalImageSizeContextMenuItem",
    "title": chrome.i18n.getMessage("context_menu_view_original_image"),
    "contexts": ["image"],
    "visible": false
});


/* Enums of Supported sites by this extension */
const Website = {
    Twitter: 'twitter.com',
    Instagram: 'instagram.com',
    Facebook: 'facebook.com',
    Reddit: 'reddit.com',
    LINE_BLOG: 'lineblog.me'
}

function GenerateRandomString(length) {
    const value = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const random = [];
    for (let i = 0; i < length; i++) {
        random.push(value[Math.floor(Math.random() * value.length)]);
    }
    return random.join("");
}

/* Vanilla JavaScript doesn"t know how to count months 🙃
[0] - January 
[1] - February
[2] - March
[3] - April
[4] - May
[5] - June
[6] - July
[7] - August
[8] - September
[9] - October
[10] - November
[11] - December */
let MonthsInNumber = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
let MonthsInLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "13"];
let MonthsInShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "13"];

/* Time & Date */
function GetDateFormat(DateTimeFormat) {

    const _date = new Date();
    let _finalTimeDateValue = "";

    switch (DateTimeFormat) {
        // 0-2 = Numerical Format
        case "0":
            _finalTimeDateValue = MonthsInNumber[_date.getMonth()] + "-" + _date.getDate() + "-" + _date.getFullYear();
            break;
        case "1":
            _finalTimeDateValue = _date.getDate() + "-" + MonthsInNumber[_date.getMonth()] + "-" + _date.getFullYear();
            break;
        case "2":
            _finalTimeDateValue = _date.getFullYear() + "-" + MonthsInNumber[_date.getMonth()] + "-" + _date.getDate();
            break;
            // 3-5 = Long Format
        case "3":
            _finalTimeDateValue = MonthsInLong[_date.getMonth()] + " " + _date.getDate() + ", " + _date.getFullYear();
            break;
        case "4":
            _finalTimeDateValue = _date.getDate() + " " + MonthsInLong[_date.getMonth()] + " " + _date.getFullYear();
            break;
        case "5":
            _finalTimeDateValue = _date.getFullYear() + " " + MonthsInLong[_date.getMonth()] + " " + _date.getDate();
            break;
            // 6-8 = Short Format
        case "6":
            _finalTimeDateValue = MonthsInShort[_date.getMonth()] + ". " + _date.getDate() + ", " + _date.getFullYear();
            break;
        case "7":
            _finalTimeDateValue = _date.getDate() + " " + MonthsInShort[_date.getMonth()] + ". " + _date.getFullYear();
            break;
        case "8":
            _finalTimeDateValue = _date.getFullYear() + " " + MonthsInShort[_date.getMonth()] + ". " + _date.getDate();
            break;
        default:
            _finalTimeDateValue = null;
            break;
    }
    return " (" + _finalTimeDateValue + ")";
}

/* Paramaters to build file name*/
let FileNameBuilder = {
    username: null,
    tweetId: null,
    randomString: null,
    fileExtension: null,
    timeanddate: null
};

/* Setup file name to return final file name */
function CreateFileName() {
    const username = FileNameBuilder.username;
    const tweetid = FileNameBuilder.tweetId;
    const randomString = FileNameBuilder.randomString;
    const fileExtension = FileNameBuilder.fileExtension;
    const _timeanddate = FileNameBuilder.timeanddate;
    let finalFileName = "";

    if (tweetid === "") {
        finalFileName = username + "-" + randomString + _timeanddate + fileExtension;
    } else {
        finalFileName = username + "-" + tweetid + "-" + randomString + _timeanddate + fileExtension;
    }
    return finalFileName;
}

/* Listens for URL from address bar when browser window is opened or entering a new URL */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
    const DEBUG_TAG = "tabsOnUpdated => ";
    console.log(DEBUG_TAG + changeInfo.status);

    chrome.tabs.query({
        "active": true,
        "currentWindow": true},

        function (tabs){
            if (changeInfo.status == "complete"){
                console.log(DEBUG_TAG + tabs[0].url);
                ToggleViewOriginalImageContextMenuVisibility(tabs[0].url);
            }

        }
    );
});

/* Listens for tab change by the user */
chrome.tabs.onActiveChanged.addListener(function(){

    const DEBUG_TAG = "tabsOnActiveChanged => ";

    chrome.tabs.query({
        "active": true,
        "currentWindow": true},

        function(tabs){
            console.log(DEBUG_TAG + tabs[0].url);
            ToggleViewOriginalImageContextMenuVisibility(tabs[0].url);            
        },
    );
});

function ToggleViewOriginalImageContextMenuVisibility(url){
    const currentUrl = url;
    const currentUrlSplit = currentUrl.split("/");
    const currentWebsite = currentUrlSplit[2];
    
    switch(currentWebsite){
        case Website.Twitter:
            chrome.contextMenus.update(viewOriginalImageSizeContextMenuItem, {
                "visible": true 
                });
            break;
        default:
            chrome.contextMenus.update(viewOriginalImageSizeContextMenuItem, {
                "visible": false 
                });
            break;
    }    
}

/* Execute everything when save image as is clicked. */
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    const currentUrl = tab.url;
    const currentUrlSplit = currentUrl.split("/");
    const currentWebsite = currentUrlSplit[2];

    switch (currentWebsite) {
        case Website.Twitter:

            if (info.menuItemId === "viewOriginalImageSizeContextMenuItem"){
                ParseOriginalMediaUrl(info.srcUrl);
                ViewTwitterOriginalImageTab();
                return;
            } 
            else if (info.menuItemId === "saveImage"){
                SaveTwitterImage(info, currentUrlSplit);
            }
            break;
        default:
            alert(chrome.i18n.getMessage("error_website_not_supported"));
            break;
    }

});

/* ---------------------FUNCTIONS FOR TWITTER------------------------ */


function ViewTwitterOriginalImageTab(){
    window.open(finalUrlOutput, "_blank");
}

function SaveTwitterImage(info, urlSplit) {
    chrome.storage.local.get({
        fileNameStringLength: "8",
        showMentionSymbol: true,
        showTweetId: true,
        twitterFileExtensionType: ".jpg",
        useDate: false,
        dateFormatting: "0"
    }, function (items) {

        const twitterUsername = urlSplit[3];
        const tweetId = urlSplit[5];
        FileNameBuilder.fileExtension = items.twitterFileExtensionType;

        if (!items.showMentionSymbol) {
            FileNameBuilder.username = twitterUsername;
        } else {
            FileNameBuilder.username = "@" + twitterUsername;
        }

        if (!items.showTweetId) {
            FileNameBuilder.tweetId = "";
        } else {
            FileNameBuilder.tweetId = tweetId;
        }

        if (!items.useDate) {
            FileNameBuilder.timeanddate = "";
        } else {
            FileNameBuilder.timeanddate = GetDateFormat(items.dateFormatting);
        }

        FileNameBuilder.randomString = GenerateRandomString(items.fileNameStringLength);

        if (tweetId == null) {
            alert(chrome.i18n.getMessage("error_tweet_detail_alert_prompt"));
            return;
        } else {
            ParseOriginalMediaUrl(info.srcUrl);
            FileDownloadManager(Website.Twitter);
        }
    });
}

let finalUrlOutput = null;

function ParseOriginalMediaUrl(url){

    const DEBUG_TAG = "ParseOriginalMediaUrl => ";

    const originalUrl = url;
    const twitterLargeImage = "&name=orig";
    const getTwitterImageFormat = originalUrl.substring(0, originalUrl.lastIndexOf("&name=") + 0);
    const updatedUrl = getTwitterImageFormat + twitterLargeImage;
    let finalImageSource = null;

    const regex_size = "&name=";
    
    if (originalUrl.includes(regex_size)){
        // If the user is using the Redesign
        finalImageSource = updatedUrl;
    }else {
        // If user is on the legacy design
        finalImageSource = originalUrl;
    }

    console.log(DEBUG_TAG + "original_url: " + originalUrl);
    console.log(DEBUG_TAG + "final_url: " + finalImageSource);

    finalUrlOutput = finalImageSource;
}

/* ---------------------END OF TWITTER FUNCTIONS------------------------ */

/* Chrome Download API Manager */
function FileDownloadManager(website) {

    const DEBUG_TAG = "FileDownloadManager => ";

    switch (website) {
        case Website.Twitter:

            console.log(DEBUG_TAG + "url: " + finalUrlOutput);
            console.log(DEBUG_TAG + "fileName: " + CreateFileName());

            chrome.downloads.download({
                url: finalUrlOutput,
                filename: CreateFileName(),
                saveAs: true
            });
            break;
    }
}

chrome.downloads.onChanged.addListener(function (downloadDelta) {
    chrome.storage.local.get({
        showDownloadFolderCheckbox: false
    }, function (items) {
        if (downloadDelta.state && downloadDelta.state.current == "complete") {
            if (items.showDownloadFolderCheckbox === true) {
                chrome.downloads.showDefaultFolder();
            }
            return;
        }
    });
});