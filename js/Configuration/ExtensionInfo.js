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

// Reference: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests


/**
 * Loads extension data from Manifest
 */
function LoadExtensionData() {
    let request = new XMLHttpRequest();

    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.readyState === 200) {
                console.log(request.responseText);
            } else {
                let jsonConfig = this.responseText;
                let jsonParse = JSON.parse(jsonConfig);
                document.getElementById("main_extension_name").textContent = jsonParse.short_name;

                if ((jsonParse.version).split(".")[3] >= 1000) {
                    document.getElementById("main_extension_version").textContent = `${jsonParse.version} (dev-build)`;

                } else if ((jsonParse.version).split(".")[3] == undefined) {
                    document.getElementById("main_extension_version").textContent = `${jsonParse.version}`;
                }

                // document.getElementById("extension_description").innerHTML = jsonParse.description;
                console.log("AND IT SHALL BE BESTOWNED UPON YOU, THE STAR WHICH YOU HAVE LONGED FOR—");
                console.log("Status: " + request.statusText + "👍");
            }
        }
    }
    request.open('GET', chrome.runtime.getURL('manifest.json'), true);
    request.onerror = function (e) {
        console.error(request.statusText);
    };

    request.send(null);
}


/**
 * Queries Browser and Operating System information
 */
function GetSystemInfo() {

    let appVersion = navigator.appVersion;
    let platformData = {};

    function isChromium() {
        for (brand_version_pair of navigator.userAgentData.brands) {
            if (brand_version_pair.brand == "Chromium") {
                return true;
            }
        }
        return false;
    }

    function queryOtherOS(av) {
        console.log(av)

        function getMacOS(av) {
            let macVersion = av.substring(31, av.lastIndexOf("OS X") + 12);
            return `macOS ${macVersion.replace(/_/gi, ".")}`;
        }

        function getChromeOS(av) {
            let chromeOSVersion = av.substring(31, av.lastIndexOf("CrOS") + 5);
            return `Chrome OS ${chromeOSVersion}`
        }

        if (av.includes("Windows NT 6.1")) {
            return "Windows 7";
        } else if (av.includes("Windows NT 6.2")) {
            return "Windows 8";
        } else if (av.includes("Windows NT 6.3")) {
            return "Windows 8.1";
        } else if (av.includes("Macintosh")) {
            return getMacOS(av);
        } else if (av.includes("CrOS")) {
            return getChromeOS(av);
        } else {
            return null;
        }

    }

    if (isChromium() == true) {
        navigator.userAgentData.getHighEntropyValues(
                ["architecture", "model", "platform", "platformVersion", "uaFullVersion"])
            .then(ua => {

                if (!!ua.uaFullVersion) {
                    platformData["browserVersion"] = `(${ua.uaFullVersion})`;
                }

                if (ua.platform == "Windows") {
                    switch (ua.platformVersion) {

                        case "0.0.0":
                            // Fallback to legacy OS query
                            queryOtherOS(appVersion);
                            break;

                        case "1.0.0":
                            platformData["os"] = "Windows 10 version 1507";
                            break;

                        case "2.0.0":
                            platformData["os"] = "Windows 10 version 1511";
                            break;

                        case "3.0.0":
                            platformData["os"] = "Windows 10 version 1607";
                            break;

                        case "4.0.0":
                            platformData["os"] = "Windows 10 version 1703";
                            break;

                        case "5.0.0":
                            platformData["os"] = "Windows 10 version 1709";
                            break;

                        case "6.0.0":
                            platformData["os"] = "Windows 10 version 1803";
                            break;

                        case "7.0.0":
                            platformData["os"] = "Windows 10 version 1809";
                            break;

                        case "8.0.0":
                            platformData["os"] = "Windows 10 version 1903/1909";
                            break;

                        case "10.0.0":
                            platformData["os"] = "Windows 10 version 2004/20H2/21H1";
                            break;

                        case "14.0.0":
                            platformData["os"] = "Windows 11 version 21H2";
                            break;

                        case "15.0.0":
                            platformData["os"] = "Windows 11 version 22H2";
                            break;

                        default:
                            platformData["os"] = "-";
                            break;

                    }
                } else {
                    platformData["os"] = queryOtherOS(appVersion);
                }


                if (ua.architecture == "x86") {
                    if (ua.platform == "Windows") {
                        platformData["architecture"] = `${ua.platform} - Intel/AMD x86-64`;
                    } else if (ua.platform == "macOS"){
                        platformData["architecture"] = `${ua.platform} - Intel/AMD x86-64`;
                    }
                }

                if (ua.architecture == "arm"){
                    if (ua.platform == "macOS"){
                        platformData["architecture"] = `${ua.platform} - Apple Silicon`;
                    }
                }
                document.getElementById("system_information_platform_value").innerHTML = platformData.architecture;
                document.getElementById("system_information_os_value").innerHTML = platformData.os;
                document.getElementById("system_information_browser_value").innerHTML = `${ua.brands[1].brand} ${platformData.browserVersion}`;

            });
    }

}

document.addEventListener("DOMContentLoaded", GetSystemInfo());
document.addEventListener("DOMContentLoaded", LoadExtensionData());