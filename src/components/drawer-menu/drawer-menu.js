class DrawerMenu extends HTMLElement {
  static observedAttributes = ["open"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.loadTemplate().then(this.attachEvents);
  }

  async loadTemplate() {
    try {
      const response = await fetch("./components/drawer-menu/drawer-menu.html");
      if (response.ok) {
        const templateText = await response.text();
        const template = document.createElement("template");
        template.innerHTML = templateText;
        const templateClone = document.importNode(template.content, true);
        this.shadowRoot.appendChild(templateClone);
      } else {
        console.error("Failed to fetch the template file.");
      }
    } catch (error) {
      console.error("Error loading the template file:", error);
    }
  }

  attachEvents = () => {
    // Open/close drawer events
    const expandBtn = this.shadowRoot.querySelector(".header__expand-menu-btn");
    const drawerContainer = this.shadowRoot.querySelector(".drawer-container");
    const closeBtn = this.shadowRoot.querySelector(".menu-sm__close-btn");

    expandBtn.addEventListener("click", () => {
      drawerContainer.setAttribute("open", "true");
    });

    closeBtn.addEventListener("click", () => {
      drawerContainer.removeAttribute("open");
    });

    // Show active link item events
    const links = this.shadowRoot.querySelectorAll(".header__menu-link");
    const smLinks = this.shadowRoot.querySelectorAll(".menu-sm__link");
    const sectionIDs = Array.from(links).map((link) => link.href.split("#")[1]);
    const positions = sectionIDs.map((sectionID) => {
      const el = document.querySelector(`#${sectionID}`);
      return window.scrollY + el.getBoundingClientRect().top;
    });
    window.addEventListener("scroll", (event) => {
      for (let i = 0; i < positions.length; i++) {
        const offset = 48; // create offset to prevent 1px differences show different active
        if (
          positions[i] < window.scrollY + offset &&
          (positions[i + 1] > window.scrollY + offset ||
            positions[i + 1] == null)
        ) {
          links[i].classList.add("active");
          smLinks[i].classList.add("active");
        } else {
          links[i].classList.remove("active");
          smLinks[i].classList.remove("active");
        }
      }
      // if (window.scrollY) {}
    });
  };

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("drawer-menu", DrawerMenu);
