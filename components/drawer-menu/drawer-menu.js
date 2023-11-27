class DrawerMenu extends HTMLElement{static observedAttributes=["open"];constructor(){super(),this.attachShadow({mode:"open"}),this.loadTemplate().then(this.attachEvents)}async loadTemplate(){try{var e,t,o,r=await fetch("./components/drawer-menu/drawer-menu.html");r.ok?(e=await r.text(),(t=document.createElement("template")).innerHTML=e,o=document.importNode(t.content,!0),this.shadowRoot.appendChild(o)):console.error("Failed to fetch the template file.")}catch(e){console.error("Error loading the template file:",e)}}attachEvents=()=>{const e=this.shadowRoot.querySelector(".header");window.addEventListener("scroll",()=>{100<window.scrollY?e.classList.add("header--bg"):e.classList.remove("header--bg")});var t=this.shadowRoot.querySelector(".header__expand-menu-btn");const o=this.shadowRoot.querySelector(".drawer-container");var r=this.shadowRoot.querySelector(".menu-sm__close-btn");t.addEventListener("click",()=>{o.setAttribute("open","true")}),r.addEventListener("click",()=>{o.removeAttribute("open")});const a=this.shadowRoot.querySelectorAll(".header__menu-link"),n=this.shadowRoot.querySelectorAll(".menu-sm__link"),s=Array.from(a).map(e=>e.href.split("#")[1]).map(e=>document.querySelector("#"+e));let l=-1,d="down",c=window.scrollY;window.addEventListener("scroll",e=>{d=0<window.scrollY-c?"down":"up",c=window.scrollY,a[l]?.classList.remove("active"),n[l]?.classList.remove("active"),l<s.length-1&&"down"===d&&s[l+1].getBoundingClientRect().top<s[l+1].offsetHeight/3?l++:"up"===d&&s[l]?.getBoundingClientRect().top>s[l]?.offsetHeight/3&&0<=l&&l--,a[l]?.classList.add("active"),n[l]?.classList.add("active")})};attributeChangedCallback(e,t,o){console.log(`Attribute ${e} has changed.`)}}customElements.define("drawer-menu",DrawerMenu);