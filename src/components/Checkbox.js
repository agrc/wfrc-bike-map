class Checkbox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const label = document.createElement('calcite-label');
    label.setAttribute('layout', 'inline');

    const checkbox = document.createElement('calcite-checkbox');
    label.appendChild(checkbox);

    const text = this.getAttribute('label');
    label.appendChild(document.createTextNode(text));

    shadow.appendChild(label);
  }
}

customElements.define('my-checkbox', Checkbox);
