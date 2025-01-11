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

import { GetLocale } from './i18n.js';

export function RenderElement(json = [], ui = "main") {

    function isNumeric(str){
        return /^\d+$/.test(str);
    }

    const table = document.createElement('table');
    table.className = 'main-body-table';


    if (json.length > 0) {
        json.forEach((x) => {

            const availableInUI = (x.show_in_ui).some((e => e == ui));
            if (availableInUI == false) return;
            
            const isInactive = x.inactive;
            if (isInactive == true) return;

            const tr = document.createElement('tr');
            const labelTd = document.createElement('td');
            const inputTd = document.createElement('td');

            const isBetaFeature = x.show_beta_badge;

            if (isBetaFeature == true){
                const betaTag = document.createElement("span");
                betaTag.className = "beta_tag";
                betaTag.textContent = GetLocale("common_label_beta");
                labelTd.appendChild(betaTag);
            }

            // Create label
            const label = document.createElement('label');
            label.textContent = GetLocale(x["data-i18n"]);
            labelTd.appendChild(label);

            // Create input based on type
            let inputElement;
            let inputType = x.field.type;
            let inputOptions = x.field.options;
            let inputID = x.field.id;

            // Settings
            let settingsSite = x.settings.website;
            let settingsKey = x.settings.key;
            let settingsObj = Settings.Load()[settingsSite].reduce((obj, data) => {
                obj[data.key] = data;
                return obj;
            }, {});

            switch (inputType) {
                case "select":
                    inputElement = document.createElement('select');
                    inputElement.id = inputID;

                    if (Array.isArray(inputOptions) && inputOptions.length > 0) {
                        inputOptions.forEach((option) => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = isNumeric(option.text) ? option.text : GetLocale(option.text);
                            inputElement.appendChild(optionElement);
                        });
                    }
                    
                    inputElement.value = settingsObj[settingsKey].value;
                    inputElement.addEventListener("change", function() {
                        Settings.Save(settingsKey, this.value);
                        showNotification(3000)
                    });
                    break;

                case "checkbox":
                    inputElement = document.createElement('input');
                    inputElement.type = 'checkbox';
                    inputElement.id = inputID;
                    inputElement.checked = settingsObj[settingsKey].value;
                    inputElement.onclick = function() {
                        Settings.Save(settingsKey, this.checked)
                        showNotification(3000)
                    };
                    break;

                default:
                    console.warn(`Unhandled input type: ${inputType}`);
                    break;
            }

            if (inputElement) {
                inputTd.appendChild(inputElement);
                tr.appendChild(labelTd);
                tr.appendChild(inputTd);
                table.appendChild(tr);
            }
        });

        return table; // Return the table element instead of a string

    } else {
        console.error("Failed to load JSON");
        return null;
    }
}

export function ShowNotAvailable(){
    
    const div = document.createElement("div");
    div.className = "popup-settings-none-available";
    div.style = "padding: 2em; text-align: center; color: #3f3f3f; font-weight: 600;"

    const notAvailableImg = document.createElement("img");
    notAvailableImg.src = "/assets/icons8-restrict-48.png";

    div.appendChild(notAvailableImg);

    const notAvailableText = document.createElement("div");
    notAvailableText.textContent = "Settings not available for this Website";

    div.appendChild(notAvailableText);

    return div;
}