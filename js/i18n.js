(function() {

    window.addEventListener('load', function() {
        var needsTranslation = document.querySelectorAll("[data-i18n]"),
            t = chrome.i18n.getMessage;
        for (var i = 0, l = needsTranslation.length; i < l; i++) {
            var element = needsTranslation[i],
                targets = element.split(/\s*,\s*/);
            for (var j = 0, m = targets.length; j < m; j++) {
                var parameters = targets[j].split(/\s*=\s*/);
                if (parameters.length === 1 || parameters[0] === 'textContent') {
                    element.textContent = t(element.dataset.i18n);
                }
                else if (parameters[0] === 'innerHTML') {
                    element.innerHTML = t(element.dataset.i18n);
                }
                else {
                    element.setAttribute(parameters[0], t(parameters[1]));
                }
            }
        }
    });
    
    }).call(this);