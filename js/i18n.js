// Code reference from: https://stackoverflow.com/questions/25467009/internationalization-of-html-pages-for-my-google-chrome-extension 

function replace_i18n(obj, tag) {
    var msg = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? chrome.i18n.getMessage(v1) : '';
    });

    if(msg != tag) obj.innerHTML = msg;
}

function localizeHtmlPage() {
    // Localize using __MSG_***__ data tags
    var data = document.querySelectorAll('[data-i18n]');

    for (var i in data) if (data.hasOwnProperty(i)) {
        var obj = data[i];
        var tag = obj.getAttribute('data-i18n').toString();

        replace_i18n(obj, tag);
    }

    // Localize everything else by replacing all __MSG_***__ tags
    var page = document.getElementsByTagName('html');

    for (var j = 0; j < page.length; j++) {
        var obj = page[j];
        var tag = obj.innerHTML.toString();

        replace_i18n(obj, tag);
    }
}

localizeHtmlPage();