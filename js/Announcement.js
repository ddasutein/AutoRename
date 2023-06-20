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


function loadRestAPI(){

    onReadyStateChange = (() => {

        try {

            if (xhr.readyState === XMLHttpRequest.DONE){
                console.info(xhr.status);
                if (xhr.status == 200){
                    result = xhr.responseText;
                    result = JSON.parse(result);

                    if (result.locked == false){
                        document.getElementById('main-body-section-announcement').style.display ='none';
                    } else {
                        document.getElementById("announcement_title").textContent = result.title;

                        let resultBody = result.body;
                        bodyContent = resultBody.substring("[0]", resultBody.indexOf("[1]"));
                        bodyContent = bodyContent.replace("[0]", "");
                        
                        bannerUrl = resultBody.substring(resultBody.indexOf("[1]"));
                        bannerUrl = bannerUrl.replace("[1]", "");

                        document.getElementById("announcement_body").textContent = bodyContent;

                        document.querySelectorAll("button").forEach((buttons)=>{
                            switch (buttons.id){
                                case "button_banner_link":
                                    buttons.addEventListener("click", (()=>{

                                        swal({
                                            title: chrome.i18n.getMessage("info_message_announcement_label"),
                                            text: `${chrome.i18n.getMessage("info_click_announcement_link")} ${bannerUrl} \n\n${chrome.i18n.getMessage("message_prompt_user_continue")}`,
                                            icon: "info",
                                            buttons: true,
                                            dangerMode: true
                                        }).then((redirect)=>{
                                            if (redirect){
                                                chrome.tabs.create({url: bannerUrl});
                                            }
                                        })

                                    }));
                                    break;
                            }
                    
                        });
                    }
                }
            }
        } catch(exception){
            console.error(exception);
            document.getElementsByClassName('main-body-section-announcement')[0].style.display ='none';
        }

    });
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/ddasutein/autorename-privacy-policy/issues/1")
    xhr.onreadystatechange = onReadyStateChange;
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function(e) { loadRestAPI() })

