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

import { ShowNotification } from "../ui/Notification.js"

export default function LoadSettings(){
    console.log(Settings.Load())
    const SETTING_ATTRIBUTE_NAME = "setting";

    let GetSettings = Settings.Load().All.reduce((obj, data) => {
        obj[data.key] = data;
        return obj;
    }, {});

    const elements = document.querySelectorAll('[setting]');
    elements.forEach((x)=>{
        const SETTING_ATTRIBUTE = x.getAttribute(SETTING_ATTRIBUTE_NAME);
        const SETTING_VALUE     = GetSettings[SETTING_ATTRIBUTE].value;
        const SETTING_KEY       = GetSettings[SETTING_ATTRIBUTE].key 

        switch (x.type) {
            case "select-one":            
            case "select":            
                x.value = SETTING_VALUE
                x.addEventListener("change", function() {
                    Settings.Save(SETTING_KEY, this.value);
                    ShowNotification(3000)
                });
                break;

            case "checkbox":
                x.checked = SETTING_VALUE;
                x.onclick = function() {
                    Settings.Save(SETTING_KEY, this.checked);
                    ShowNotification(3000)
                };
                break;

            case "text":
                x.value = SETTING_VALUE;
                x.addEventListener("blur", function(){
                    Settings.Save(SETTING_KEY, this.value);
                    ShowNotification(3000)
                })
                break;

            default:
                console.warn(`Unhandled input type: ${x.type}`);
                break;
        }

    })
}