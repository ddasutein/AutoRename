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

export function ShowNotification (duration = 3000) {
    const notification = document.getElementById("notification");
    const audio = new Audio("/assets/audio/notification-2-269292.mp3");
    let playSoundFx = true;

    // Resets the class when this is called to prevent it ffrom getting stuck
    notification.classList.remove("show", "hide");
    notification.classList.add("show");
    
    notification.addEventListener("animationend", onAnimationEnd, { once: true });

    function onAnimationEnd(event) {
        if (event.animationName === "showNotification") {
            
            if (playSoundFx == true){
                audio.play().catch(error => {
                    console.log(`Audio playback error : ${error}`)
                });
                playSoundFx = false;
            }
            
            setTimeout(() => {
                notification.classList.remove("show");
                notification.classList.add("hide");
                notification.addEventListener("animationend", onHideAnimationEnd, { once: true });
                playSoundFx = true;
            }, duration);
        }
    }
    
    function onHideAnimationEnd(event) {
        if (event.animationName === "hideNotification") {
            notification.classList.remove("hide");
            notification.style.opacity = "0";
        }
    }
}