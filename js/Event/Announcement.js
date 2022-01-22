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

        if (xhr.readyState === XMLHttpRequest.DONE){

            if (xhr.status == 200){
                result = xhr.responseText;
                result = JSON.parse(result);

                if (result.locked == false){
                    document.getElementsByClassName('main-body-section-announcement')[0].style.display ='none';
                } else {
                    document.getElementById("announcement_title").textContent = result.title;
                    document.getElementById("announcement_body").textContent = result.body;
                }
            }
        }
    });
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/ddasutein/autorename-privacy-policy/issues/1")
    xhr.onreadystatechange = onReadyStateChange;
    xhr.send();
}

window.addEventListener("load", loadRestAPI());

