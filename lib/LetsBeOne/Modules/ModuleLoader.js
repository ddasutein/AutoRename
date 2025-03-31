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

const Modules = {};

const ModulesList = [
    "./Announcement/Announcement.js",
    "./RecentItems/RecentItems.js"
]

function loader(modulePath){
    return import(modulePath).then(module => {

        const moduleName = modulePath.split("/").pop().replace(".js", "");
        Modules[moduleName] = module;
        return module;

    }).catch(err => {
        console.log("Module Loader FAILED")
        console.log(err);
    })
}

export function ModuleLoad() {

    const promises = ModulesList.map(m => loader(m));
    return Promise.all(promises).then(() => {
        return true;
    }).catch(error => {
        console.error("Error in module loading:", error);
        return false;
    });


}
document.addEventListener('DOMContentLoaded', (event) => {

    const ui = document.querySelector(`meta[name="ui"]`).content;
    switch (ui){
        case "main":
            ModuleLoad().then((success) => {
                if (success && Modules.Announcement && Modules.Announcement.Announcement) {
                    Modules.Announcement.Announcement();
                    Modules.RecentItems.RecentItems();
                } else {
                    console.error("Announcement module could not be loaded or used.");
                }
            }).catch((error) => {
                console.error("Module load process failed:", error);
            });
            break;
    }
});