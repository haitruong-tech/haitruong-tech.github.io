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
    // Add background to header
    const header = this.shadowRoot.querySelector(".header");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) header.classList.add("header--bg");
      else header.classList.remove("header--bg");
    })

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
    const elements = sectionIDs.map((sectionID) =>
      document.querySelector(`#${sectionID}`)
    );
    let currentActive = -1,
      direction = "down",
      lastPos = window.scrollY;

    window.addEventListener("scroll", (event) => {
      if (window.scrollY - lastPos > 0) {
        direction = "down";
      } else {
        direction = "up";
      }
      lastPos = window.scrollY;
      links[currentActive]?.classList.remove("active");
      smLinks[currentActive]?.classList.remove("active");
      if (
        currentActive < elements.length - 1 &&
        direction === "down" &&
        elements[currentActive + 1].getBoundingClientRect().top <
          elements[currentActive + 1].offsetHeight / 3
      ) {
        currentActive++;
      } else if (
        direction === "up" &&
        elements[currentActive]?.getBoundingClientRect().top >
          elements[currentActive]?.offsetHeight / 3 &&
        currentActive >= 0
      ) {
        currentActive--;
      }
      links[currentActive]?.classList.add("active");
      smLinks[currentActive]?.classList.add("active");
    });
  };

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("drawer-menu", DrawerMenu);
