/** MIT License
 * 
 * Copyright (c) 2024 Dasutein
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


const themeSelector = document.getElementById("theme-selector");
console.log("HTML theme engine loaded");

let isUserUsingAuto = false;

const SetTheme = ((theme = "dark")=>{
    if (theme == "dark"){
        document.documentElement.setAttribute("page-theme", "dark");
    } else if (theme == "" || theme == null || theme == undefined || theme == "light"){
        document.documentElement.removeAttribute("page-theme", "dark");
    }
});

themeSelector.addEventListener('change', () => {

    switch (themeSelector.value){
        case "light":
            SetTheme("light");
            isUserUsingAuto = false;
            break;
        case "dark":
            SetTheme("dark");
            isUserUsingAuto = false;
            break;
        case "auto":
            const userPreferDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            userPreferDarkMode == true ? SetTheme("dark") : SetTheme("light");
            isUserUsingAuto = true;
            break;
    }
});

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => {

    if (isUserUsingAuto == true){
        if (e.matches) {
            SetTheme("dark");
        } else {
            SetTheme("light");
        }
    }

});