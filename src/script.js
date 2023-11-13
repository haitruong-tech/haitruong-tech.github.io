import "./components/drawer-menu/drawer-menu.js";
import "./components/contact-form/contact-form.js";

window.addEventListener("load", () => {
  const arrowDown = document.querySelector(".cover__arrow-container");
  arrowDown.addEventListener("click", () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  });
});
