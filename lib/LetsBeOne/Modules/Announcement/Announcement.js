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

import { GetLocale } from "../../i18n.js";

export function Announcement() {

    function parseJSON(x){
        const currentBrowserLanguage = (chrome.i18n.getUILanguage()).substring(0,2);
        const isLocked = x.locked;
        const postTitle = x.title;
        let postBody    = (x.body).replace(/```/g, "");
        postBody = JSON.parse(postBody);
        postBody = postBody.data;

        if (isLocked == true){
            const announcementDiv = document.getElementById("main-body-section-announcement");
            announcementDiv.style.display = "block";

            const announcementHead = document.createElement("div");
            announcementHead.className = "announcement-head";
            announcementHead.textContent = GetLocale("common_label_announcement");
            announcementDiv.appendChild(announcementHead);

            const announcementContentArea = document.createElement("div");
            announcementContentArea.className = "announcement-content-area";

            const announcementTextContent = document.createElement("div");
            announcementTextContent.id = "announcement_text_area";
            announcementTextContent.className = "announcement_text_area";

            let announcementTitle   = "";
            let announcementText    = "";
            let announcementLink    = "";

            if (postBody.hasOwnProperty(currentBrowserLanguage)){           
                announcementTitle   = postBody[currentBrowserLanguage]["post"].title    ? postBody[currentBrowserLanguage]["post"].title : postTitle;
                announcementText    = postBody[currentBrowserLanguage]["post"].message;
                announcementLink    = postBody[currentBrowserLanguage]["post"].link;
            } else {

                // Fallback to English announcement
                announcementTitle   = postBody["en"]["post"].title    ? postBody["en"]["post"].title : postTitle;
                announcementText    = postBody["en"]["post"].message;
                announcementLink    = postBody["en"]["post"].link;

            }

            const announcementTitleTag = document.createElement("span");
            announcementTitleTag.className = "announcement_title";
            announcementTitleTag.textContent = announcementTitle;
            announcementTextContent.appendChild(announcementTitleTag);

            const announcementBodyTag = document.createElement("span");
            announcementBodyTag.className = "announcement_body";
            announcementBodyTag.textContent = announcementText;
            announcementTextContent.appendChild(announcementBodyTag);
            announcementContentArea.appendChild(announcementTextContent);
            announcementContentArea.appendChild(document.createElement("hr"));

            const announcementButtonsContainer = document.createElement("div");
            announcementButtonsContainer.className = "announcement-buttons";
            announcementContentArea.appendChild(announcementButtonsContainer);

            const announcementButtonMoreDetails = document.createElement("button");
            announcementButtonMoreDetails.className = "autorename_primary_button_secondary";
            announcementButtonMoreDetails.id = "button_banner_link";
            announcementButtonMoreDetails.textContent = GetLocale("common_banner_more_detail");
            announcementButtonMoreDetails.onclick = function(){
                swal({
                    title: chrome.i18n.getMessage("info_message_announcement_label"),
                    text: `${chrome.i18n.getMessage("info_click_announcement_link")} ${announcementLink} \n\n${chrome.i18n.getMessage("message_prompt_user_continue")}`,
                    icon: "info",
                    buttons: true,
                    dangerMode: true
                }).then((redirect)=>{
                    if (redirect){
                        chrome.tabs.create({url: announcementLink});
                    }
                })
            }
            announcementButtonsContainer.appendChild(announcementButtonMoreDetails);
            announcementDiv.appendChild(announcementContentArea);
        }
    }

    const MAX_TIME_LIMIT_BEFORE_NETWORK_REFRESH = 5.0;
    const AnnouncementUri = "https://api.github.com/repos/ddasutein/autorename-privacy-policy/issues/2";

    const getRateLimitCount = localStorage.getItem("x-ratelimit-limit");
    const getRemainingRateLimit = localStorage.getItem("x-ratelimit-remaining");
    const getRateLimitReset = localStorage.getItem("x-ratelimit-reset");
    const getRateConsumed = localStorage.getItem("x-ratelimit-used");
    const getResponseContent = localStorage.getItem("response_data");
    const getLastNetworkRequestTime = localStorage.getItem("last_network_request_time_in_unix");
    const currentTimeInUnix = moment().format("X");

    let unixTime1 = moment.unix(getLastNetworkRequestTime);
    let unixTime2 = moment.unix(currentTimeInUnix);
    let timeDiff = Math.abs(unixTime1.diff(unixTime2, "minutes", true));
    console.log("load announce")
    if (timeDiff >= MAX_TIME_LIMIT_BEFORE_NETWORK_REFRESH) {

        fetch(AnnouncementUri, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `${navigator.userAgent} ${chrome.runtime.getManifest().name}/${chrome.runtime.getManifest().version}`
            }
        }).then((x) => {
            let headers = {};
            const responseHeaders = x.headers;
            for (let RH of responseHeaders.entries()) {
                headers[RH[0]] = RH[1];
            }

            localStorage.setItem("x-ratelimit-limit", headers["x-ratelimit-limit"]);
            localStorage.setItem("x-ratelimit-remaining", headers["x-ratelimit-remaining"]);
            localStorage.setItem("x-ratelimit-reset", headers["x-ratelimit-reset"]);
            localStorage.setItem("x-ratelimit-used", headers["x-ratelimit-used"]);
    
            const httpStatus = x.status;
    
            // Note: GitHub API has rate limit of 60 requests PER HOUR
            if (httpStatus == 200){
                return x.json().then((jsonResp) => {
                    localStorage.setItem("last_network_request_time_in_unix", moment().format("X"));
                    localStorage.setItem("response_data", JSON.stringify(jsonResp));
                    return jsonResp;
                });
            } else {
                return JSON.parse(localStorage.getItem("response_data"));
            }
    
        }).then((x) => {
            parseJSON(x);
        }).catch((err) => {
            console.error("Failed to fetch Announcement");
            console.error(err);
            // document.getElementById('main-body-section-announcement').style.display ='none';
        });

    } else {
        parseJSON(JSON.parse(getResponseContent));
    }
}
