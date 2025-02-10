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


(() => {
    
    document.addEventListener("DOMContentLoaded", (async () => {
        const ThemePreference = Settings.Load().General.reduce((obj, data) =>{
            obj[data.key] = data;
            return obj
        }, {})["global_theme"].value;
    
        const ui = document.querySelector(`meta[name="ui"]`).content;
        const themeSelector = document.getElementById("theme_selector");
    
        console.log("HTML theme engine loaded");
        
        let isUserUsingAuto = false;
        
        const SetTheme = ((theme = "dark")=>{
            if (theme == "dark"){
                document.documentElement.setAttribute("page-theme", "dark");
            } else if (theme == "" || theme == null || theme == undefined || theme == "light"){
                document.documentElement.removeAttribute("page-theme", "dark");
            }
        });
    
        switch (ThemePreference){
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
        
        switch (ui){
            case "main":
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
                break;
            case "popup":
                isUserUsingAuto = true;
                break;
        }
        
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

    }));


})();
