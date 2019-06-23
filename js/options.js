function save_options(){

    let fileNameStringLength = document.getElementById('twitter_string_length').value;
    let includeMentionSymbol = document.getElementById('twitter_mention').checked;
    let includeTweetId = document.getElementById('twitter_tweet_id').checked;

    chrome.storage.local.set({
        fileNameStringLength: fileNameStringLength,
        showMentionSymbol: includeMentionSymbol,
        showTweetId: includeTweetId
    }, function(){
        alert("Preferences saved");
    });
}

function load_options(){
    chrome.storage.local.get({
        fileNameStringLength: '8',
        showMentionSymbol: true,
        showTweetId: true
    }, function(items) {
        document.getElementById('twitter_string_length').value = items.fileNameStringLength;
        document.getElementById('twitter_mention').checked = items.showMentionSymbol;
        document.getElementById('twitter_tweet_id').checked = items.showTweetId;
    });
}
document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('buttonSaveTwitterPref').addEventListener('click',
    save_options);