// GET info from manifest.json
var request = new XMLHttpRequest();
request.open('GET', chrome.extension.getURL('manifest.json'), false);
request.send(null);
var manifest = JSON.parse(request.responseText);


function loadExtensionVersion() {
  document.getElementById("extension_version").innerHTML = 'Version: ' + manifest.version;
}

function loadExtensionName() {
  document.getElementById("extension_name").innerHTML = manifest.name;
}

function loadExtensionDescription() {
  document.getElementById("extension_description").innerHTML = manifest.name;
}

document.addEventListener('DOMContentLoaded', loadExtensionVersion);
document.addEventListener('DOMContentLoaded', loadExtensionName);
document.addEventListener('DOMContentLoaded', loadExtensionDescription);