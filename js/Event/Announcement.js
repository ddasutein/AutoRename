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
    function onReadyStateChange(){
        if (xhr_.readyState === XMLHttpRequest.DONE){
            if (xhr_.status == 200){
                result = xhr_.responseText;
                console.log("REST RESPONSE");
                console.log(JSON.parse(result));
                result = JSON.parse(result);
                console.log(result.locked)
                if (result.locked == false){
                    document.getElementsByClassName('main-body-section-announcement')[0].style.display ='none';
                } else {
                    document.getElementById("announcement_title").textContent = result.title;
                    document.getElementById("announcement_body").textContent = result.body;

                }
            }
        }
    }
    

    let xhr_ = new XMLHttpRequest();
    xhr_.open("GET", "https://api.github.com/repos/ddasutein/AutoRename/issues/24")
    xhr_.onreadystatechange = onReadyStateChange;
    xhr_.send();
}

window.addEventListener("load", loadRestAPI());

