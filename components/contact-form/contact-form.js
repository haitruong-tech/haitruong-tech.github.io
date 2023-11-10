const base_url = "./components/contact-form";

class ContactForm extends HTMLElement {
  static observedAttributes = ["state"];

  constructor() {
    super();
    this.status = "idle";
    this.attachShadow({ mode: "open" });
    this.loadTemplate().then(this.attachEvents);
  }

  async loadTemplate() {
    try {
      const response = await fetch(`${base_url}/contact-form.html`);
      if (response.ok) {
        const templateText = await response.text();
        const template = document.createElement("template");
        template.innerHTML = templateText;
        const templateClone = document.importNode(template.content, true);

        const drawerMenuCSS = await fetch(`${base_url}/contact-form.css`);
        if (!drawerMenuCSS.ok) {
          console.error("failed to fetch CSS");
          return;
        }
        const cssText = await drawerMenuCSS.text();
        const style = document.createElement("style");
        style.textContent = cssText;
        templateClone.appendChild(style);

        this.shadowRoot.appendChild(templateClone);
      } else {
        console.error("Failed to fetch the template file.");
      }
    } catch (error) {
      console.error("Error loading the template file:", error);
    }
  }

  attachEvents = () => {
    const contactForm = this.shadowRoot.querySelector(".contact__form");

    contactForm.addEventListener("submit", async (event) => {
      // TODO: add debounce
      try {
        event.preventDefault();
        if (this.status === "loading" || this.status === "submitted") {
          alert("The email is sending, please wait");
          return;
        }

        contactForm.setAttribute("status", "loading");

        // TODO: deploy backend
        const data = new FormData(contactForm);
        await fetch(
          "https://mail-server-ntl.netlify.app/.netlify/functions/mail-server",
          {
            body: JSON.stringify(Object.fromEntries(data.entries())),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        contactForm.setAttribute("status", "submitted");
      } catch (error) {
        contactForm.setAttribute("status", "error");
        console.error("Something went wrong:", error);
      }
    });
  };

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("contact-form", ContactForm);
