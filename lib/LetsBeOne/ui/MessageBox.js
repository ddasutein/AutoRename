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

export function MessageBox () {
    return {

        autoCloseTimer: 1500,
    
        Save: (() => {
    
            return swal({
                title: "",
                text: chrome.i18n.getMessage("context_save_success"),
                icon: "success",
                buttons: false,
                dangerMode: false,
                timer: messageBox.autoCloseTimer
            });
        }),
    
        Warning: ((title, message) => {
            return swal({
                title: title,
                text: message,
                icon: "warning",
                buttons: false,
                dangerMode: false
            });
        })
    }
}