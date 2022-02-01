document.querySelectorAll("button").forEach((buttons)=>{
    if (buttons.id == "button_help_twitter"){
        buttons.addEventListener("click", (()=>{
            chrome.tabs.create({url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"});
        }));   
    }

    switch (buttons.id){

        case "button_save_general":
            buttons.addEventListener("click", (()=>{
                swal({
                    title: "General",
                    text: "Text test",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                  }).then((willDelete)=>{
                    if (willDelete) {
                      swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your imaginary file is safe!", {
                        icon: "info"
                      });
                    }
                  })
            }));

            break;

        case "button_save_twitter":
            buttons.addEventListener("click", (()=>{
                swal({
                    title: "Twitter",
                    text: "Text test",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                  }).then((willDelete)=>{
                    if (willDelete) {
                      swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                      });
                    } else {
                      swal("Your imaginary file is safe!", {
                        icon: "info"
                      });
                    }
                  })
            }));
        
            break;

        case "button_save_lineblog":
            buttons.addEventListener("click", (()=>{
                swal({
                    title: "LINE BLOG",
                    text: "Text test",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                    }).then((willDelete)=>{
                    if (willDelete) {
                        swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                        });
                    } else {
                        swal("Your imaginary file is safe!", {
                        icon: "info"
                        });
                    }
                    })
            }));
        
            break;

        case "button_save_reddit":
            buttons.addEventListener("click", (()=>{
                swal({
                    title: "Reddit",
                    text: "Text test",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                    }).then((willDelete)=>{
                    if (willDelete) {
                        swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success",
                        });
                    } else {
                        swal("Your imaginary file is safe!", {
                        icon: "info"
                        });
                    }
                    })
            }));
        
            break;

        case "button_help_general":
            buttons.addEventListener("click", (()=>{
                chrome.tabs.create({url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#general"});
            }));
            break;

        case "button_help_twitter":
            buttons.addEventListener("click", (()=>{
                chrome.tabs.create({url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#twitter"});
            }));
            break;

        case "button_help_lineblog":
            buttons.addEventListener("click", (()=>{
                chrome.tabs.create({
                    url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#line-blog"
                });
            }));
            break;

        case "button_help_reddit":
            buttons.addEventListener("click", (()=>{
                chrome.tabs.create({
                    url: "https://github.com/ddasutein/AutoRename/wiki/%E2%9A%99-Settings#reddit"
                });
            }));
            break;


    }
});