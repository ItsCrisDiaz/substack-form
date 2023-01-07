class SubstackForm extends HTMLElement {
  constructor() {
    super();
    this.errorSvg =
      /* html */
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    this.emailErrorMessage = "Please use a valid e-mail.";
    this.processErrorMessage = `Something is not working, please try again.`;
    this.successSvg =
      /* html */
      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    this.successMessage = ``;
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["domain", "max-width", "button-width", "input", "submit"];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    attr === "domain" && (this.domain = newVal);
    attr === "max-width" && (this.width = newVal);
    attr === "button-width" && (this.buttonWidth = newVal);
    attr === "input" && (this.input = newVal);
    attr === "submit" && (this.submit = newVal);
  }

  getStyles() {
    return /* html */ `<style>
      :host {
        --max-width: ${this.width};
        --button-width: ${this.buttonWidth};
        --brand-color: var(--substack-brand, #881010);
        --button-text: var(--substack-button-text, #f5f5f5);
        --success-bg: var(--substack-success-bg, #bbf7c7);
        --success-text: var(--substack-success-text, #0d7221);
        --error-bg: var(--substack-error-bg, #fce8e8);
        --error-text: var(--substack-error-text, #720d0d);
      }

      :host *,
      :host *::before,
      :host *::after {
        box-sizing: border-box;
      }

      .form > * + * {
        margin-top: var(--flow-space, 1em);
      }

      .container {
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
        max-width: var(--max-width);
        margin-inline: auto;
      }

      .container > :last-child {
        display: flex;
        align-items: flex-end;
        flex-basis: var(--button-width);
        flex-grow: 1;
      }

      .container > :first-child {
        display: grid;
        gap: 0.5em;
        justify-items: start;
        flex-basis: 0;
        flex-grow: 999;
        min-inline-size: 50%;
      }

      .label {
        font-weight: bold;
      }

      .input {
        padding-inline: 0.5ch;
        width: 100%;
        line-height: 2;
        font-family: inherit;
        font-size: inherit;
        border: 2px solid var(--brand-color);
      }

      :is(.input, .submit):focus-visible {
        outline: 2px solid var(--brand-color);
        outline-offset: 2px;
      }

      .submit {
        display: grid;
        place-items: center;
        padding: 0.5em 1em;
        width: 100%;
        color: var(--button-text);
        background-color: var(--brand-color);
        font-weight: bold;
        font-family: inherit;
        font-size: inherit;
        border-radius: 1em;
        border-color: transparent;
      }

      .loader {
        text-align: center;
      }

      .loader:focus {
        outline: none;
      }

      .loading {
        aspect-ratio: 1;
        margin-inline: auto;
        width: 3rem;
        border-radius: 50%;
        border: 5px solid #eaf0f6;
        border-top-color: var(--brand-color);
        animation: spinner 2s linear infinite;
      }

      .status {
        --status-bg: var(--success-bg);
        --status-text: var(--success-text);
        padding: 1em;
        margin-inline: auto;
        max-width: 50ch;
        border: 2px solid var(--status-text);
        background-color: var(--status-bg);
        color: var(--status-text);
        border-radius: 0.5em;
      }

      .status:focus {
        outline: none;
      }

      .status:empty {
        display: none;
      }

      .status[data-inline] {
        margin-inline: 0;
        width: fit-content;
      }

      .status.error {
        --status-bg: var(--error-bg);
        --status-text: var(--error-text)
      }

      .status svg {
        width: 1em;
        height: 1em;
        vertical-align: middle;
        display: inline-flex;
        margin-right: 0.5ch;
      }

      @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>`;
  }

  getTemplate() {
    const template = document.createElement("template");

    template.innerHTML =
      /* html */

      `
      ${this.getStyles()}
      <form class="form" novalidate>
        <div class="container">
          <div>
            <label class="label" for="substackForm">${this.input}</label>
            <p class="status error" id="substackInputError" data-inline data-form-error></p>
            <input class="input" id="substackForm" type="email" aria-describedby="substackInputError" required  />
          </div>
          <div>
            <button class="submit" type="submit">${this.submit}</button>
          </div>
        </div>
        <div role="status" aria-busy="true" class="loader flow" tabindex="-1">
        </div>
        <div role="status" class="status" tabindex="-1" data-form-state></div>
      </form>`;

    return template;
  }

  render() {
    this.shadowRoot.innerHTML = this.getTemplate().innerHTML;
    this.innerHTML = "";
  }

  connectedCallback() {
    // this.innerHTML = this.getTemplate().content.cloneNode(true);
    this.render();

    // Get newly created form elements
    const form = this.shadowRoot.querySelector("form");
    const email = this.shadowRoot.querySelector("input");
    const loading = this.shadowRoot.querySelector(".loader");
    const error = this.shadowRoot.querySelector("[data-form-error]");
    const announce = this.shadowRoot.querySelector("[data-form-state]");

    // Handle submit events
    async function submitHandler(event) {
      // Stop the form from reloading
      event.preventDefault();

      // Make sure an email address was provided
      if (!email.value) {
        error.innerHTML = `${this.errorSvg} ${this.emailErrorMessage}`;
        error.classList.remove("success");
        error.classList.add("error");
        email.focus();
        return;
      }

      try {
        // Call the API
        announce.innerHTML = "";
        error.innerHTML = "";
        this.inputEmail = email.value;
        loading.innerHTML = `<div class="loading"></div>
        <p><b>Enviando...</b></p>`;
        loading.focus();
        let request = await fetch(
          "https://us-central1-substackapi.cloudfunctions.net/subscribe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.inputEmail,
              domain: this.domain,
            }),
          }
        );

        // Get the response and show the message in the UI
        let response = await request.json();
        loading.innerHTML = "";
        if (this.successMessage) {
          announce.innerHTML = `<p>${this.successSvg} ${this.successMessage}</p>`;
        } else {
          announce.innerHTML = `<p>${this.successSvg} Thanks for subscribing! We have sent you an email to <b>${this.inputEmail}</b> to complete the process.</p>`;
        }
        announce.classList.remove("error");
        announce.classList.add("success");
      } catch (error) {
        // If something went wrong, show the error instead

        loading.hidden = true;
        announce.innerHTML = `<p>${this.errorSvg} ${this.processErrorMessage}</p>`;
        announce.classList.remove("success");
        announce.classList.add("error");
      }
    }

    // Listen for submit events
    form.addEventListener("submit", submitHandler.bind(this));
  }
}

customElements.define("substack-form", SubstackForm);
