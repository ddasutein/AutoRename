console.log("POPUP HTML")

const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(tabContent => tabContent.classList.remove("active"));
        tabs.forEach(tabContent => tabContent.classList.remove("active"));
        tab.classList.add("active");
        target.classList.add("active");
    });
});

const prefColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
console.log(prefColorScheme)

if (prefColorScheme.matches) {
    document.body.classList.toggle("light");
  } else {
    document.body.classList.toggle("dark");
  }


  document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        // document.getElementById("button_save").addEventListener("click", SaveOptions2);
    }
}

function testClick(btn){
  let btnId = btn.id;
  alert(btnId)
}

function SaveOptions2(){
  // swal("", "This is a test dialog!", "success", {
  //   buttons: false,
  //   timer: 1500
  // })

  // swal({
  //   title: "Test",
  //   text: "Text test",
  //   icon: "warning",
  //   buttons: true,
  //   dangerMode: true
  // }).then((willDelete)=>{
  //   if (willDelete) {
  //     swal("Poof! Your imaginary file has been deleted!", {
  //       icon: "success",
  //     });
  //   } else {
  //     swal("Your imaginary file is safe!", {
  //       icon: "info"
  //     });
  //   }
  // })
}
