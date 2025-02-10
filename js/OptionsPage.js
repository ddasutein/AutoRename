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

import { GetLocale } from "../lib/LetsBeOne/i18n.js";

const specialCharacters = new RegExp(/[?!@#$%^&*(),';\:*"<>|/]/g);


/**
 * Validates the customized date/time format in the text field before processing it
 * to Moment JS. This is also checks for special characters that are not permitted by
 * the operating system
 * 
 * @param {*} settingsKey The corresponding key in settings
 * @param {*} dateString  Date string
 * @returns 
 */
function ValidateDateTimeFormat(settingsKey, dateString) {

    let output = {};

    if (dateString == "" || dateString == null || dateString == undefined) {
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
        output["is_error"] = true;
    } else {

        // Check for special characters that are not allowed by the operating system
        if (dateString.match(specialCharacters)) {
            isValidDateFormat = false;

            output["title"] = chrome.i18n.getMessage("error_title_invalid");
            output["message"] = chrome.i18n.getMessage("error_validation_date_time_format");
            output["is_error"] = true;

        } else {
            output["is_error"] = false;
        }

    }

    if (output.is_error) {
        return output;
    } else {
        Settings.Save(settingsKey, dateString);
        return output;
    }
}

/**
 * Checks prefix for illegal or disallowed characters by the operating system
 * 
 * @param {*} settingsKey The corresponding key in settings
 * @param {*} prefixString 
 * @returns 
 */
function ValidatePrefix(settingsKey, prefixString) {

    let output = {};
    if (prefixString.match(specialCharacters)) {
        output["title"] = chrome.i18n.getMessage("error_title_invalid");
        output["message"] = chrome.i18n.getMessage("error_validation_prefix");
        output["is_error"] = true;
    } else {
        output["is_error"] = false;
    }

    if (output.is_error) {
        return output;
    } else {
        Settings.Save(settingsKey, prefixString);
        return output;
    }
}

/**
 * Perform execution after page has loaded
 * 
 */
document.addEventListener("DOMContentLoaded", (async () => {

    const Button = {
        Type: {
            Primary: "autorename_primary_button_horizontal",
            Secondary: "autorename_primary_button_secondary"
        }
    }

    //#region Tab Switching Logic
    const tabs = document.querySelectorAll("[data-tab-target]");
    const tabContents = document.querySelectorAll("[data-tab-content]");

    const optionsConfig = Settings.Load().OptionsUI.map((data)=>{
        return {
            "key": data.key,
            "value": data.value
        }
    }).reduce((obj, data)=>{
        obj[data.key] = data;
        return obj;
    }, {});
    
    createDownloadCardItem();

    function InsertButtons(params, site){
        const buttonContainer = document.getElementById("options-quick-actions-button-container");
        const buttons = buttonContainer.getElementsByTagName("button");
        while(buttons.length > 0){
            buttonContainer.removeChild(buttons[0]);
        }

        const getButtons = params[site].buttons;
        getButtons.forEach((x) => {
            const button = document.createElement("button");
            const buttonClass = (x.class).charAt(0).toUpperCase() + (x.class).slice(1);

            button.id = x.id;
            button.className = Button["Type"][buttonClass];

            const buttonContent = document.createElement("div");
            buttonContent.className = "button-content-container";
            
            if (x.icon){
                const img = document.createElement("img");
                img.src = x.icon;
                buttonContent.appendChild(img);
            }

            const par = document.createElement("p");
            par.textContent = GetLocale(x.name);
            buttonContent.appendChild(par);
            button.appendChild(buttonContent);

            buttonContainer.appendChild(button);
        });
    }

    let tabConfig = await fetch(chrome.runtime.getURL("/ui/settings/tabs.json")).then((resp) => {
        return resp.json();
    }).then((res) => {
        return res;
    }).catch((err) => {
        console.warn("Fetch error >> " + err);
    });
    
    tabConfig = tabConfig.reduce((obj, data) => {
        obj[data.id] = data;
        return obj;
    }, {});

    tabs.forEach((tab, idx) => {

        if (idx == optionsConfig["optionsUITabIndexNumber"].value){
            const target = document.querySelector(optionsConfig["optionsUITabName"].value);
            tabContents.forEach(tabContent => tabContent.classList.remove("active"));
            tabs.forEach(tabContent => tabContent.classList.remove("active"));
            tab.classList.add("active");
            target.classList.add("active");

            const sectionTitle = document.getElementById("options-section-title")
            const sectionDescription = document.getElementById("options-section-description");
            const sectionLogo = document.getElementById("options-section-logo");
            sectionTitle.textContent        = GetLocale(tabConfig[tab.dataset.tabTarget].name);
            sectionDescription.textContent  = GetLocale(tabConfig[tab.dataset.tabTarget].description);
            sectionLogo.src                 = tabConfig[tab.dataset.tabTarget].logo;
            InsertButtons(tabConfig, tab.dataset.tabTarget);

        }

        tab.addEventListener("click", () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tabContents.forEach(tabContent => tabContent.classList.remove("active"));
            tabs.forEach(tabContent => tabContent.classList.remove("active"));
            tab.classList.add("active");
            target.classList.add("active");

            const sectionTitle = document.getElementById("options-section-title")
            const sectionDescription = document.getElementById("options-section-description");
            const sectionLogo = document.getElementById("options-section-logo");
            sectionTitle.textContent        = chrome.i18n.getMessage(tabConfig[tab.dataset.tabTarget].name);
            sectionDescription.textContent  = chrome.i18n.getMessage(tabConfig[tab.dataset.tabTarget].description);
            sectionLogo.src                 = tabConfig[tab.dataset.tabTarget].logo;
            InsertButtons(tabConfig, tab.dataset.tabTarget);
            Settings.Save("optionsUITabName", tab.dataset.tabTarget);
            Settings.Save("optionsUITabIndexNumber", idx);

        });
    });
    //#endregion

}));


function createDownloadCardItem(indexNumber, objData){

    let download_card_container = document.getElementById("download_card_container");
    let download_card_container_history = document.getElementById("download_card_container_history");
    let download_queue_label = document.getElementById("download-queue-label");
    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (0)`;

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];

    /**
     * This scenario triggers on a fresh installation as by default, it is a string value.
     */
    if (typeof downloadJSONData == "string" && downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    }

    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    } 
   

    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (${downloadJSONData.length})`;

    let buttonIds = [];
    downloadJSONData.forEach((x, idx)=>{
        
        buttonIds.push({
            primary: `download-primary-${idx}`,
            secondary: `download-secondary-${idx}`,
            download_card_ids: `download-card-${idx}`,
            index_count: idx
        });
        download_card_container.innerHTML += `
        <div class="download-card" id="download-card-${idx}">
            <img class="image-thumbnail image-thumbnail-${idx}" src="${x.url}"></img>
            <div class="download-card-info download-card-info-${idx}">
                <div class="download-card-site download-card-site-${idx}">${x.website}</div>
                <div class="download-card-info download-card-info-${idx}">${x.filename_display}</div>
            </div>
            <div class="download-card-actions" id="download-card-actions">
                <button id="download-secondary-${idx}" class="download-card-actions-button-secondary autorename_primary_button_danger" value="${idx}"><p>${chrome.i18n.getMessage("downloads_section_button_remove")}</p></button>
                <button id="download-primary-${idx}" class="download-card-actions-button-primary autorename_primary_button_secondary" value="${idx}"><p>${chrome.i18n.getMessage("downloads_section_button_download")}</p></button>
            </div>
        </div>
        `;
    });
    updateDownloadButtonListeners(buttonIds);
    buttonIds = []; // Clear when done

}

function createDownloadHistoryCardItem(indexNumber, objData){

    let download_card_container = document.getElementById("download_card_container_history");
    let download_card_container_history = document.getElementById("download_card_container_history");
    let download_queue_label = document.getElementById("download-queue-label");
    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (0)`;

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_history_data").map((x) => x.value)[0];

    /**
     * This scenario triggers on a fresh installation as by default, it is a string value.
     */
    if (typeof downloadJSONData == "string" && downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    }

    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0){
        download_card_container.innerHTML += `<div style="width=100%;"><p>${chrome.i18n.getMessage("downloads_section_empty_queue")}</p></div>`;
        return;
    } 
   

    download_queue_label.textContent = `${chrome.i18n.getMessage("downloads_section_count_label")} (${downloadJSONData.length})`;

    let buttonIds = [];
    downloadJSONData.forEach((x, idx)=>{
        
        buttonIds.push({
            primary: `download-primary-${idx}`,
            secondary: `download-secondary-${idx}`,
            download_card_ids: `download-card-${idx}`,
            index_count: idx
        });
        download_card_container.innerHTML += `
        <div class="download-card" id="download-card-${idx}">
            <img class="image-thumbnail image-thumbnail-${idx}" src="${x.url}"></img>
            <div class="download-card-info download-card-info-${idx}">
                <div class="download-card-site download-card-site-${idx}">${x.website}</div>
                <div class="download-card-info download-card-info-${idx}">${x.filename}</div>
            </div>
            <div class="download-card-actions" id="download-card-actions">
                <button id="download-secondary-${idx}" class="download-card-actions-button-secondary value="${idx}">${chrome.i18n.getMessage("downloads_section_button_remove")}</button>
                <button id="download-primary-${idx}" class="download-card-actions-button-primary" value="${idx}">${chrome.i18n.getMessage("downloads_section_button_download")}</button>
            </div>
        </div>
        `;
    });
    updateDownloadButtonListeners(buttonIds);
    buttonIds = []; // Clear when done

}

function updateDownloadButtonListeners(downloadBtns){

    let downloadJSONData = Settings.Load().General;
    downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];
    downloadJSONData = JSON.parse(downloadJSONData);
    if (downloadJSONData.length == 0 || typeof downloadJSONData != "object") return;

    downloadBtns.forEach((x, idx)=>{

        let deleteButton = document.getElementById(x.secondary);
        let downloadButton = document.getElementById(x.primary);

        deleteButton.addEventListener("click", ((e) => {
            swal({
                title: "Remove from Queue",
                text: "Are you sure you want to remove this file?",
                icon: "warning",
                buttons: {
                    cancel: true,
                    confirm: true
                }
            }).then((result)=>{
                if (result){
                    downloadJSONData = downloadJSONData.filter((x, jsonIdx) => jsonIdx != idx);
                    Settings.Save("global_download_queue_data", JSON.stringify(downloadJSONData));
                    Utility.SetBadgeText(downloadJSONData.length);
                    window.location.reload();
                }
            }).catch((error)=> console.error(error));
        }));

        downloadButton.addEventListener("click", ((e) => {
            let data = downloadJSONData.filter((x, jsonIdx) => jsonIdx == idx)[0];
            DownloadManager.StartDownload([{filename: data.filename, url: data.url}]);

            // Remove once downloaded
            data = downloadJSONData.filter((v, jsonIdx) => jsonIdx != idx);
            Settings.Save("global_download_queue_data", JSON.stringify(data));
            window.location.reload();
        }));

    });
    
}