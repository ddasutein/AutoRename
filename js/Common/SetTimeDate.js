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

    const DEBUG_TAG = "GetDateFormat => ";

    if (DevMode){
        console.log(DEBUG_TAG + "DateTimeFormat: " + DateTimeFormat);
    }

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

    if (DevMode){
        console.log(DEBUG_TAG + "finalTimeDateValue: " + _finalTimeDateValue);
    }

    return "(" + _finalTimeDateValue + ")";
}