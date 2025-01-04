/** MIT License
 * 
 * Copyright (c) 2025 Dasutein
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

export function GetLocale(localeString) {
    if (!localeString) throw Error("Locale string missing");

    let locale = chrome.i18n.getMessage(localeString);
    if (!locale || locale == "" || locale == null || locale == undefined){
        locale = `<MISSING_LOCALE_STRING : ${localeString}>`;
    }

    return locale;
    
}