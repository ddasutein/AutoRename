/* References
* Dataset => https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
* My post => https://stackoverflow.com/questions/57566463/clarification-on-i18n-implementation-for-chromium-extensions
* */

const elements = document.querySelectorAll('[data-i18n]');

function SetLocale() {
    elements.forEach(el => el.innerHTML = chrome.i18n.getMessage(el.dataset.i18n));
}

// function SetLocale() {
//     document.getElementById("settings_developed_by_dasutein").innerHTML = chrome.i18n.getMessage("settings_developed_by_dasutein");
//     document.getElementById("settings_github_link").innerHTML = chrome.i18n.getMessage("settings_github_link");
//     document.getElementById("settings_label_general_settings").innerHTML = chrome.i18n.getMessage("settings_label_general_settings");
//     document.getElementById("settings_general_settings_show_download_folder").innerHTML = chrome.i18n.getMessage("settings_general_settings_show_download_folder");

//     document.getElementById("settings_label_twitter").innerHTML = chrome.i18n.getMessage("settings_label_twitter");
//     document.getElementById("settings_label_twitter_description").innerHTML = chrome.i18n.getMessage("settings_label_twitter_description");
//     document.getElementById("settings_twitter_include_mention_symbol").innerHTML = chrome.i18n.getMessage("settings_twitter_include_mention_symbol");
//     document.getElementById("settings_twitter_include_tweet_id").innerHTML = chrome.i18n.getMessage("settings_twitter_include_tweet_id");
//     document.getElementById("settings_twitter_include_tweet_date").innerHTML = chrome.i18n.getMessage("settings_twitter_include_tweet_date");
//     document.getElementById("settings_twitter_generate_string").innerHTML = chrome.i18n.getMessage("settings_twitter_generate_string");
//     document.getElementById("settings_twitter_file_extension_type").innerHTML = chrome.i18n.getMessage("settings_twitter_file_extension_type");

//     document.getElementById("button_save").innerHTML = chrome.i18n.getMessage("button_save");

// }

document.addEventListener("DOMContentLoaded", SetLocale);