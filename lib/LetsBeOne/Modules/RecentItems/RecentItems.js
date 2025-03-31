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

export function RecentItems() {

    function createContextMenu(){

        const menuItems = [
            {
                "name": "View Photo",
                "id": "context-menu-item-view-photo",
                "icon": "/assets/icons8-photo-48.png",
                "isinactive": false
            }, {
                "name": "Download",
                "id": "context-menu-item-download",
                "icon": "/assets/icons8-download-48.png",
                "isinactive": true
            }, {
                "name": "Share",
                "id": "context-menu-item-share",
                "icon": "/assets/icons8-share-48.png",
                "isinactive": false
            }, {
                "name": "Remove from Recents",
                "id": "context-menu-item-remove-item",
                "icon": "/assets/icons8-remove-48.png",
                "isinactive": false
            }, {
                "name": "Get Info",
                "id": "context-menu-item-download",
                "icon": "/assets/icons8-info-48.png",
                "isinactive": true
            }
        ];

        const contextMenu = document.createElement("div");
        contextMenu.id = "contextMenu";
        contextMenu.className = "context-menu";
    
        let _menuItems = menuItems.filter((x => x.isinactive == false));
        _menuItems.forEach((x) => {

            const contextMenuItemContainer = document.createElement("div");
            contextMenuItemContainer.className = "context-menu-container";

            const contextMenuItemIcon = document.createElement("img");
            contextMenuItemIcon.className = "context-menu-item-icon";
            contextMenuItemIcon.src = x.icon;

            const contextMenuItem = document.createElement("div");
            contextMenuItem.id = x.id;
            contextMenuItem.textContent = x.name;

            contextMenuItemContainer.appendChild(contextMenuItemIcon);
            contextMenuItemContainer.appendChild(contextMenuItem);
            contextMenu.appendChild(contextMenuItemContainer);
        });

        document.getElementById("context_menu_container").appendChild(contextMenu);
    }

    function renderContextMenu(data){
        const menu = document.getElementById('contextMenu');
        const contextMenuButton = document.getElementsByClassName("trigger-context-menu");

        for (let i = 0; i < contextMenuButton.length; i++) {
            contextMenuButton[i].onclick = function(e) {

                const dots = e.target;

                /**
                 * Capture the ID from the three-dots context menu button.
                 */
                const srcElementId = e.srcElement.id;
                if (data.length > 0){
                    let _data = data.filter((x => x.id == srcElementId)).reduce((obj, data) => {
                        obj[data.id] = data;
                        return obj;
                    }, {});

                    const viewPhoto = document.getElementById("context-menu-item-view-photo");
                    viewPhoto.onclick = function(){
                        window.open(_data[srcElementId].media_url);
                    }

                    const share = document.getElementById("context-menu-item-share");
                    share.onclick = function(){
                        navigator.share({
                            title: _data[srcElementId].website,
                            text: _data[srcElementId].file_name,
                            url: _data[srcElementId].url
                          });
                    }

                    const removeRecentItem = document.getElementById("context-menu-item-remove-item");
                    removeRecentItem.onclick = function(){
                        let _data = data.filter((x => x.id != srcElementId));
                        Settings.Save("global_download_history_data", JSON.stringify(_data));
                        document.getElementById(dots.closest(".card").id).remove();
                        menu.style.display = "none";
                    }
                }

                e.preventDefault();

                // Position the menu near the three dots
                const rect = dots.getBoundingClientRect();
                console.log(`${rect.bottom} / ${rect.top} / ${rect.left} / ${rect.right}`)
                menu.style.top = `${rect.bottom}px`;

                let pxLeftOffset = rect.left;
                if (rect.left >= 1830.546875){
                    pxLeftOffset = `${rect.left - 200}`;
                }
                menu.style.left = `${pxLeftOffset}px`;

                // Toggle menu visibility
                if (menu.style.display === "block") {
                    menu.style.display = "none";
                } else {
                    menu.style.display = "block";
                }
            };
        }

        document.addEventListener("click", function(e) {
            if (!menu.contains(e.target) && !e.target.classList.contains("trigger-context-menu")) {
                menu.style.display = "none"
            }
        });
    }

    const recentItems = JSON.parse(Settings.Load().General[5].value);
    console.log(recentItems)
    const recentItemContainer = document.getElementById("recent-item-container");
    createContextMenu();

    recentItems.forEach((x) => {
        
        const ID = x.id; 
        const snsLocaleString = ( GetLocale("button_view_on_sns") ).replace("{sns}", x.website);

        const cardDiv = document.createElement("div");
        cardDiv.className = "card";
        cardDiv.id = `c-${x.id}`

        const cardHeadImageContainer = document.createElement("div");
        cardHeadImageContainer.className = "image-container";

        //#region CARD IMAGE CONTAINER -- START
        const cardHeadImage = document.createElement("img");
        cardHeadImage.src = x.media_url;
        cardHeadImageContainer.appendChild(cardHeadImage);

        cardDiv.appendChild(cardHeadImageContainer);
        //#endregion CARD IMAGE CONTAINER -- END

        const cardContent = document.createElement("div");
        cardContent.className = "card-content";

        //#region CARD HEAD -- START
        const cardContentHead = document.createElement("div");
        cardContentHead.className = "card-head";

        const cardContentHeadWebsite = document.createElement("div");
        cardContentHeadWebsite.className = "card-label";
        cardContentHeadWebsite.textContent = x.website;
        cardContentHead.appendChild(cardContentHeadWebsite);


        const contextMenuTriggerDots = document.createElement("div");
        contextMenuTriggerDots.textContent = "⋯";
        contextMenuTriggerDots.className = "trigger-context-menu three-dots";

        // This is used as identifier for the custom context menu
        contextMenuTriggerDots.id = ID;

        cardContentHead.appendChild(cardContentHeadWebsite)
        cardContent.appendChild(cardContentHead);
        cardContentHead.appendChild(contextMenuTriggerDots)
        //#endregion CARD HEAD -- END

        const titleHead = document.createElement("h2");
        titleHead.textContent = x.title;

        const bodyArea = document.createElement("p");
        bodyArea.textContent = x.file_name;

        cardContent.appendChild(titleHead);
        cardContent.appendChild(bodyArea);

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";

        const snsButton = document.createElement("button");
        snsButton.id = ID;
        snsButton.className = "autorename_primary_button_horizontal";
        snsButton.textContent = snsLocaleString;
        snsButton.onclick  = function(){
            window.open(x.url);
        }
        buttonGroup.appendChild(snsButton);

        cardDiv.appendChild(cardContent);
        cardDiv.appendChild(buttonGroup);

        recentItemContainer.appendChild(cardDiv);

    });

    renderContextMenu(recentItems);
}