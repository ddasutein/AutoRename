function GetOperatingSystem(){

    let os = null;
    let appVersion = navigator.appVersion;
    let windows_nt_10 = "Windows NT 10.0";
    let windows_nt_6_1 = "Windows NT 6.1";
    let windows_nt_6_2 = "Windows NT 6.2";
    let windows_nt_6_3 = "Windows NT 6.3";
    let macOS = "Macintosh";
    let chromeOS = "CrOS";

    if (appVersion.includes(windows_nt_10)){
        os = "Windows 10"
    }
    else if (appVersion.includes(windows_nt_6_1)){
        os = "Windows 7"
    }
    else if (appVersion.includes(windows_nt_6_2)){
        os = "Windows 8"
    }
    else if (appVersion.includes(windows_nt_6_3)){
        os = "Windows 8.1"
    }
    else if (appVersion.includes(macOS)){
        let mac_version = appVersion.substring(31, appVersion.lastIndexOf("OS X") + 12);
        os = "macOS " + mac_version.replace(/_/gi, ".");
    }
    else if (appVersion.includes(chromeOS)){
        let chrome_os_version = appVersion.substring(31, appVersion.lastIndexOf("CrOS") + 5);
        os = "Chrome OS " + chrome_os_version;
    }
    else {
        // If running on unsupported Operating Systems
        os = appVersion;
    }

    document.getElementById("system_information_os").innerHTML = os;
}

function GetPlatform(){
    const platform = navigator.platform;
    document.getElementById("system_information_platform").innerHTML = platform;
}

function GetCurrentLanguage(){

    let lang = "";
    switch (navigator.language){
        case ar:
            lang = "Arabic";
            break;
        case am:
            lang = "Amharic";
            break;
        case bg:
            lang = "Bulgarian";
            break;
        case bn:
            lang = "Bengali";
            break;
        case ca:
            lang = "Catalan";
            break;
        case cs:
            lang = "Czech";
            break;
        case da:
            lang = "Danish";
            break;
        case de:
            lang = "German";
            break;
        case el:
            lang = "Greek";
            break;
        case en:
            lang = "English";
            break;
        case en_GB:
            lang = "English (Great Britain)";
            break;
        case en_US:
            lang = "English (United States)";
            break;

    }
    document.getElementById("about_lang_info").innerHTML = lang;
}

document.addEventListener("DOMContentLoaded", GetOperatingSystem());
document.addEventListener("DOMContentLoaded", GetPlatform());
document.addEventListener("DOMContentLoaded", GetCurrentLanguage());