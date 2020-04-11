/** MIT License
 * 
 * Copyright (c) 2020 Dasutein
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * See more: https://github.com/ddasutein/AutoRename/blob/master/LICENSE
 * 
 */

/* References
* Dataset => https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
* My post => https://stackoverflow.com/questions/57566463/clarification-on-i18n-implementation-for-chromium-extensions
* */

const elements = document.querySelectorAll('[data-i18n]');

function SetLocale() {
    elements.forEach(el => el.innerHTML = chrome.i18n.getMessage(el.dataset.i18n));
}

document.addEventListener("DOMContentLoaded", SetLocale);