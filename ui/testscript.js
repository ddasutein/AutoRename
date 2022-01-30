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