// Reference: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
let request = new XMLHttpRequest();

request.onload = function(e) {
  if (request.readyState === 4){
    if (request.readyState === 200){
      console.log(request.responseText);
    } else{
      let jsonConfig = this.responseText;
      let jsonParse = JSON.parse(jsonConfig);
      document.getElementById("extension_name").innerHTML = jsonParse.name;
      document.getElementById("extension_version").innerHTML = 'Version: ' + jsonParse.version;
      document.getElementById("extension_description").innerHTML = jsonParse.description;
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

