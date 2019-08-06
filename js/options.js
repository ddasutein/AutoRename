function SaveOptions() {

    // General Settings
    let showDownloadFolderCheckbox = document.getElementById("showDownloadFolderCheckbox").checked;

    // Twitter Settings
    let fileNameStringLength = document.getElementById("twitter_string_length").value;
    let includeMentionSymbol = document.getElementById("twitter_mention").checked;
    let includeTweetId = document.getElementById("twitter_tweet_id").checked;
    let twitterFileExtensionType = document.getElementById("twitter_file_extension_type").value;
    let useDate = document.getElementById("IsUsingDateCheckbox").checked;
    let dateFormatting = document.getElementById("DateFormatTypeSelect").value;

    chrome.storage.local.set({
        // General Settings
        showDownloadFolderCheckbox: showDownloadFolderCheckbox,

        // Twitter Settings
        fileNameStringLength: fileNameStringLength,
        showMentionSymbol: includeMentionSymbol,
        showTweetId: includeTweetId,
        twitterFileExtensionType: twitterFileExtensionType,
        useDate: useDate,
        dateFormatting: dateFormatting

    }, function () {
        alert("Preferences saved");
    });
}

function LoadOptions() {
    chrome.storage.local.get({
        // General Settings
        showDownloadFolderCheckbox: false,

        // Twitter Settings
        fileNameStringLength: "8",
        showMentionSymbol: true,
        showTweetId: true,
        twitterFileExtensionType: ".jpg",
        useDate: false,
        dateFormatting: "0"

    }, function (items) {
        // General Settings
        document.getElementById("showDownloadFolderCheckbox").checked = items.showDownloadFolderCheckbox;

        // Twitter Settings
        document.getElementById("twitter_string_length").value = items.fileNameStringLength;
        document.getElementById("twitter_mention").checked = items.showMentionSymbol;
        document.getElementById("twitter_tweet_id").checked = items.showTweetId;
        document.getElementById("twitter_file_extension_type").value = items.twitterFileExtensionType;
        document.getElementById("IsUsingDateCheckbox").checked = items.useDate;
        document.getElementById("DateFormatTypeSelect").value = items.dateFormatting;

        UseDateFormat(items.useDate);
    });
}

let IsUsingDateChecked = document.getElementById("IsUsingDateCheckbox");
let DateFormatTypeSelect = document.getElementById("DateFormatTypeSelect");

function UseDateFormat(IsUsingDate) {
    if (!IsUsingDate) {
        DateFormatTypeSelect.disabled = true;
    } else {
        DateFormatTypeSelect.disabled = false;
    }
}

IsUsingDateChecked.onchange = function () {
    if (!!this.checked) {
        DateFormatTypeSelect.disabled = false;
    } else {
        DateFormatTypeSelect.disabled = true;
    }
}

// let IsUsingDateChecked = document.getElementById("IsUsingDateCheckbox");
// let IsUsingTwitterApiDateChecked = document.getElementById("IsUsingTwitterApiDateCheckbox");
// let DateFormatTypeSelect = document.getElementById("DateFormatTypeSelect");

// IsUsingDateChecked.onchange = function(){
//     if (!!this.checked){
//         DateFormatTypeSelect.disabled = false;
//     }
//     else {
//         DateFormatTypeSelect.disabled = true;
//     }
// }

// IsUsingDateChecked.onchange = function() {
//     if (!!this.checked){
//         // Uncheck and Disable Twitter Api Checkbox
//         IsUsingTwitterApiDateChecked.checked = false;
//         IsUsingTwitterApiDateChecked.disabled = true;

//         // Enable DateFormatTypeSelect
//         DateFormatTypeSelect.disabled = false;
//     }else {
//         DateFormatTypeSelect.disabled = true;
//         IsUsingTwitterApiDateChecked.disabled = false;
//     }
// };

// IsUsingTwitterApiDateChecked.onchange = function(){
//     if (!!this.checked){
//         // Uncheck and Disable Use Date Format Checkbox and DateFormatSelect
//         IsUsingDateChecked.checked = false;
//         IsUsingDateChecked.disabled = true;
//         DateFormatTypeSelect.disabled = true;
//     }
//     else {
//         IsUsingDateChecked.disabled = false;
//     }
// }

document.addEventListener("DOMContentLoaded", LoadOptions);
document.getElementById("buttonSaveTwitterPref").addEventListener("click",
    SaveOptions);