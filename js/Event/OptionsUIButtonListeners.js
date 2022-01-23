document.querySelectorAll("button").forEach((buttons)=>{
    if (buttons.id == "button_help_twitter"){
        buttons.addEventListener("click", (()=>{
            chrome.tabs.create({url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"});
        }));   
    }
});