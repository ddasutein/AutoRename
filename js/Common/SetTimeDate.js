/** MIT License
 * 
 * Copyright (c) 2022 Dasutein
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

function getTimeDate(pref = {}){

    const specialCharacters = new RegExp(/[:/]/g)

    // based on browser language setting
    let uiLanguage = chrome.i18n.getUILanguage();

    if (pref.prefer_locale_format == true){
        return moment().locale(uiLanguage).format("LL");
    } else {
        timedate = moment().format(pref.date_format);
        if (timedate.match(specialCharacters)){
            timedate = timedate.replace(specialCharacters, "_");
        }

        return timedate;
    }
}

/* Time & Date */
function GetDateFormat(DateTimeFormat) {

    const DEBUG_TAG = "GetDateFormat => ";

    const _date = new Date();
    let _finalTimeDateValue = "";

    switch (DateTimeFormat) {
        // 0-2 = Numerical Format
        case "0":
            return "MM-DD-YYYY";
        case "1":
            return "DD-MM-YYYY";
        case "2":
            return "YYYY-MM-DD";
            // 3-5 = Long Format
        case "3":
            return "MMMM DD, YYYY";
        case "4":
            return "DD MMMM YYYY";
        case "5":
            return "YYYY MMMM DD";
            // 6-8 = Short Format
        case "6":
            return "MMM DD, YYYY";
        case "7":
            return "DD MMM YYYY";
        case "8":
            return "YYYY MMM DD";
        default:
            _finalTimeDateValue = null;
            break;
    }

    return "(" + _finalTimeDateValue + ")";
}