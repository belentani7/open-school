/* BELENTANI//OS — NEOGLASS REACTIVE ENGINE · Vanilla JS · Zero Dependencies · AGPLv3 */
(() => {
  "use strict";
  const CONFIG = { selector: "[data-belentani], .bel-btn", maxTilt: 3.5, rippleDuration: 650, plasmaSpeed: 0.0008 };
  class BelentaniReactiveGlass {
    constructor(root = document) {
      this.root = root; this.buttons = []; this.pointer = { x: 0, y: 0 }; this.time = 0; this.init();
    }
    init() { this.collect(); this.bindGlobal(); this.startEngine(); }
    collect() {
      this.buttons = [...this.root.querySelectorAll(CONFIG.selector)];
      this.buttons.forEach(button => this.prepare(button));
    }
    prepare(button) {
      button.classList.add("bel-reactive");
      button.style.setProperty("--mx", "50%"); button.style.setProperty("--my", "50%");
      button.style.setProperty("--rx", "0deg"); button.style.setProperty("--ry", "0deg");
      button.style.setProperty("--energy", "0"); button.style.setProperty("--distance", "999px");
      button.addEventListener("pointermove", event => this.move(button, event));
      button.addEventListener("pointerleave", () => this.leave(button));
      button.addEventListener("pointerdown", () => this.press(button));
      button.addEventListener("click", event => this.ripple(button, event));
      button.addEventListener("focus", () => button.classList.add("is-focused"));
      button.addEventListener("blur", () => button.classList.remove("is-focused"));
    }
    move(button, event) {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty("--mx", `${x}%`); button.style.setProperty("--my", `${y}%`);
      button.style.setProperty("--rx", `${-((y - 50) / 50) * CONFIG.maxTilt}deg`);
      button.style.setProperty("--ry", `${((x - 50) / 50) * CONFIG.maxTilt}deg`);
      button.style.setProperty("--energy", "1");
      button.classList.add("is-hovering");
    }
    leave(button) {
      button.style.setProperty("--mx", "50%"); button.style.setProperty("--my", "50%");
      button.style.setProperty("--rx", "0deg"); button.style.setProperty("--ry", "0deg");
      button.style.setProperty("--energy", "0");
      button.classList.remove("is-hovering");
    }
    press(button) {
      button.classList.remove("is-pressed");
      requestAnimationFrame(() => {
        button.classList.add("is-pressed");
        setTimeout(() => button.classList.remove("is-pressed"), 180);
      });
    }
    ripple(button, event) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "bel-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }
    bindGlobal() {
      window.addEventListener("pointermove", event => {
        this.pointer.x = event.clientX; this.pointer.y = event.clientY;
        document.documentElement.style.setProperty("--global-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--global-y", `${event.clientY}px`);
      }, { passive: true });
    }
    startEngine() {
      const tick = timestamp => {
        this.time = timestamp;
        document.documentElement.style.setProperty("--plasma-time", timestamp * CONFIG.plasmaSpeed);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    loading(button, state = true) {
      if (state) { button.classList.add("is-loading"); button.setAttribute("aria-busy", "true"); }
      else { button.classList.remove("is-loading"); button.removeAttribute("aria-busy"); }
    }
    glitch(button) {
      button.classList.add("is-glitch");
      setTimeout(() => button.classList.remove("is-glitch"), 420);
    }
    pulse(button) {
      button.classList.add("is-pulsing");
      setTimeout(() => button.classList.remove("is-pulsing"), 900);
    }
  }
  window.BelentaniGlass = new BelentaniReactiveGlass();
})();
