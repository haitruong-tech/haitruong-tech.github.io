import"./components/drawer-menu/drawer-menu.js";import"./components/contact-form/contact-form.js";window.addEventListener("load",()=>{document.querySelector(".cover__arrow-container").addEventListener("click",()=>{document.getElementById("about").scrollIntoView({behavior:"smooth"})})});const registerServiceWorker=async()=>{if("serviceWorker"in navigator)try{var e=await navigator.serviceWorker.register("/service-worker.js",{scope:"/"});e.installing?console.log("Service worker installing"):e.waiting?console.log("Service worker installed"):e.active&&console.log("Service worker active")}catch(e){console.error("Registration failed with "+e)}};registerServiceWorker();