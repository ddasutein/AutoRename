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
import { GetLocale } from "../i18n.js";

export default function LoadSettings(){

    function RunFieldValidation(className, fieldValue){

        function HasSpecialCharacters(str){
            const specialCharacters = new RegExp(/[?!@#$%^&*(),';\:*"<>|/]/g);
            if (str.match(specialCharacters)){
                return true;
            } else {
                return false;
            }
        }

        function IsValidDateFormat(str){
            const currentDateNow = moment();
            const formattedDate = currentDateNow.format(str);
            const parsedDate = moment(formattedDate, str, true);
            return parsedDate.isValid();
        }

        let result = true;
        let tmp = [];
        
        // Add the HTML classes here to run field validation
        const classTarget = ["custom_prefix", "custom_date_format"];

        if (className.includes(" ")){
            tmp = className.split(" ");
        } else {
            tmp.push(className);
        }

        const classNameRet = tmp.find((x => classTarget.includes(x)));
        if (classNameRet != undefined){
            switch (classNameRet){
                case "custom_prefix":
                    if (HasSpecialCharacters(fieldValue)){
                        
                        swal({
                            title: GetLocale("downloads_section_dialog_empty_queue_title"),
                            text: GetLocale("downloads_section_empty_queue"),
                            icon: "error",
                            buttons: false,
                            dangerMode: false
                        });

                        result = false;
                    }
                    break;
                case "custom_date_format":

                    const dateFormatInvalidTitle    = "error_title_invalid";
                    const dateFormatInvalidText     = "error_validation_date_time_format";

                    if (!IsValidDateFormat(fieldValue)){
                        swal({
                            title: GetLocale(dateFormatInvalidTitle),
                            text: GetLocale(dateFormatInvalidText),
                            icon: "error",
                            buttons: false,
                            dangerMode: false
                        });
                        result = false;
                    }

                    if (HasSpecialCharacters(fieldValue)){
                        swal({
                            title: GetLocale(dateFormatInvalidTitle),
                            text: GetLocale(dateFormatInvalidText),
                            icon: "error",
                            buttons: false,
                            dangerMode: false
                        });
                        result = false;
                    }
                    
                    break;
            }
        }

        return result;
    }

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
                    ShowNotification()
                });
                break;

            case "checkbox":
                x.checked = SETTING_VALUE;
                x.onclick = function() {
                    Settings.Save(SETTING_KEY, this.checked);
                    ShowNotification()
                };
                break;

            case "text":
                x.value = SETTING_VALUE;
                x.addEventListener("blur", function(){

                    const isValidField = RunFieldValidation(x.className, this.value)
                    if (isValidField){
                        Settings.Save(SETTING_KEY, this.value);
                        ShowNotification();
                    }
                })
                break;

            default:
                console.warn(`Unhandled input type: ${x.type}`);
                break;
        }

    })
}