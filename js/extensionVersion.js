var requestJson = new XMLHttpRequest();
requestJson.open('GET', 'manifest.json');
requestJson.responseType = 'json';
requestJson.send();

function version(jsonObj){
    console.log("extension_version:" + requestJson.response.version);
    return requestJson.response.version;
}