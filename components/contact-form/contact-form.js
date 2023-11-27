const base_url="/components/contact-form";class ContactForm extends HTMLElement{static observedAttributes=["state"];constructor(){super(),this.status="idle",this.attachShadow({mode:"open"}),this.loadTemplate().then(this.attachEvents)}async loadTemplate(){try{var t,e,a,s=await fetch(base_url+"/contact-form.html");s.ok?(t=await s.text(),(e=document.createElement("template")).innerHTML=t,a=document.importNode(e.content,!0),this.shadowRoot.appendChild(a)):console.error("Failed to fetch the template file.")}catch(t){console.error("Error loading the template file:",t)}}attachEvents=()=>{const a=this.shadowRoot.querySelector(".contact__form");a.addEventListener("submit",async t=>{try{var e;t.preventDefault(),"loading"===this.status||"submitted"===this.status?alert("The email is sending, please wait"):(a.setAttribute("status","loading"),e=new FormData(a),await fetch("https://mail-server-ntl.netlify.app/.netlify/functions/mail-server",{body:JSON.stringify(Object.fromEntries(e.entries())),method:"POST"}),a.setAttribute("status","submitted"))}catch(t){a.setAttribute("status","error"),console.error("Something went wrong:",t)}})};attributeChangedCallback(t,e,a){console.log(`Attribute ${t} has changed.`)}}customElements.define("contact-form",ContactForm);