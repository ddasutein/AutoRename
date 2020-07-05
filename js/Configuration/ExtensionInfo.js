/** MIT License
 * 
 * Copyright (c) 2020 Dasutein
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
let request = new XMLHttpRequest();



request.onload = function(e) {
  if (request.readyState === 4){
    if (request.readyState === 200){
      console.log(request.responseText);
    } else{
      let jsonConfig = this.responseText;
      let jsonParse = JSON.parse(jsonConfig);
      document.getElementById("main_extension_name").innerHTML = jsonParse.short_name;

      if (document.querySelector('meta[name="current_page"]').content == "about"){

        document.getElementById("main_extension_version").innerHTML = jsonParse.version;
        document.getElementById("system_information_os").innerHTML = navigator.appVersion;
        document.getElementById("system_information_platform").innerHTML = navigator.platform;
      }

      // document.getElementById("extension_description").innerHTML = jsonParse.description;
      console.log("AND IT SHALL BE BESTOWNED UPON YOU, THE STAR WHICH YOU HAVE LONGED FOR—");
      console.log("Status: " + request.statusText + "👍");
    }
  }
}
request.open('GET', chrome.extension.getURL('manifest.json'), true);
request.onerror = function (e) {
  console.error(request.statusText);
};

request.send(null);

