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

export function CreateZip(nodeId) {

    function urlToPromise(url) {
        return new Promise(function (resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    

    let testElement = document.getElementById(nodeId);
    let msg = "";
    testElement.addEventListener("click", function(e){
        let isDone = false;
        function createZip(zipName){
            
            let downloadJSONData = Settings.Load().General;
            downloadJSONData = downloadJSONData.filter((x) => x.key == "global_download_queue_data").map((x) => x.value)[0];
            if (typeof downloadJSONData == "string" && downloadJSONData.length == 0) {
                return swal({
                    title: chrome.i18n.getMessage("downloads_section_dialog_empty_queue_title"),
                    text: chrome.i18n.getMessage("downloads_section_empty_queue"),
                    icon: "error",
                    buttons: false,
                    dangerMode: false
                });
            }
            
            downloadJSONData = JSON.parse(downloadJSONData);
            
            let zip = new JSZip();
            downloadJSONData.forEach((x)=>{
                zip.file(x.filename, urlToPromise(x.url), { binary: true});
            });
            zip.generateAsync({
                type: "blob",streamFiles: true
            }, function updateCallback(metaData){

                if(metaData.currentFile) {
                    
                    if (metaData.percent > 0){
                        msg = `${chrome.i18n.getMessage("downloads_section_saving_file")} ${metaData.currentFile} ${chrome.i18n.getMessage("downloads_section_saving_file_2")} ${metaData.percent.toFixed(2)}%`;
                    } else if (metaData.percent == 0){
                        msg = `${chrome.i18n.getMessage("downloads_section_saving_file_3")}`
                    }

                    swal({
                        title: chrome.i18n.getMessage("downloads_section_downlaod_in_progress"),
                        text: `${msg}`,
                        closeOnClickOutside: false,
                        buttons: false
                    })

                }

            }).then(function callback(blob){
                saveAs(blob, zipName)
                swal({
                    title: chrome.i18n.getMessage("downloads_section_downlaod_complete_title"),
                    text: zipName,
                    icon: "success"
                }).then(()=>{
                    Settings.Save("global_download_queue_data", "");
                    window.location.reload();
                    DownloadManager.UpdateBadge();
                    Utility.SetBadgeText(0);
                });

            });
           return isDone;
        }


        swal({
            text: chrome.i18n.getMessage("downloads_section_dialog_enter_zip_name"),
            content: "input",
            button: {
              text: chrome.i18n.getMessage("downloads_section_dialog_enter_zip_name_button_create"),
              closeModal: false,
            },
          })
          .then(name => {
            if (!name) throw null;

           return createZip(name);
          }).catch(error =>{
            if (error == null){
                swal({
                    title: chrome.i18n.getMessage("error_title"),
                    text: chrome.i18n.getMessage("error_download_queue_invalid_file_name"),
                    icon: "warning",
                })
            }
            console.error(error);
          })
    })
    
}