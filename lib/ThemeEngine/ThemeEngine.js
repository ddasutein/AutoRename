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
const body = document.body;
console.log("HTML theme engine loaded");

let isUserUsingAuto = false;

themeSelector.addEventListener('change', () => {

    switch (themeSelector.value){
        case "light":
            body.classList.remove("dark-mode");
            isUserUsingAuto = false;
            break;
        case "dark":
            body.classList.add("dark-mode");
            isUserUsingAuto = false;
            break;
        case "auto":
            const userPreferDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            userPreferDarkMode == true ? body.classList.add('dark-mode') : body.classList.remove('dark-mode');
            isUserUsingAuto = true;
            break;
    }
});

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => {

    console.log(`isUserUsingAuto? ${isUserUsingAuto}`)
    if (isUserUsingAuto == true){
        if (e.matches) {
            body.classList.add('dark-mode');
            themeSelector.value = 'auto';
        } else {
            body.classList.remove('dark-mode');
            themeSelector.value = 'light';
        }
    }

});