class ModelViewer extends HTMLElement {
  template;
  style;
  configurator;

  constructor() {
    super();
    this.initTemplate();
    this.initStyle();
  }

  initTemplate() {
    this.template = document.createElement('template');
    this.template.innerHTML = `
      <iframe
        id="model-viewer"
        allowfullscreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        frameborder="0"
      ></iframe>
    `;
  }

  initStyle() {
    this.style = document.createElement('style');
    this.style.textContent = `
      iframe {
        width: 100%;
        height: 100%
      }
    `;
  }

  static get observedAttributes() {
    return [
      'data-url-id',
      'data-base-textures-url',
      'data-material-texture-urls',
      'data-selected-material-texture-url',
      'data-toggled-material',
    ];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;

    if (attributeName === 'data-url-id') return;
    if (attributeName === 'data-base-texture-url') return;

    if (attributeName === 'data-material-texture-urls') this.initConfigurator();
    else if (attributeName === 'data-selected-material-texture-url') this.selectMaterialTexture(this[attributeName]);
    else if (attributeName === 'data-toggled-material') this.toggleNode(this[attributeName]);
  }

  initConfigurator() {
    this.configurator = new Configurator(this['data-url-id'], this['data-base-textures-url']);
    this.configurator.init(JSON.parse(this['data-material-texture-urls']));
  }

  selectMaterialTexture(attr) {
    const [materialName, textureUrl] = Object.entries(JSON.parse(attr))[0];
    this.configurator.setMaterialTexture(materialName, textureUrl);
  }

  toggleNode(attr) {
    const [materialName, show] = Object.entries(JSON.parse(attr))[0];
    if (show) this.showMaterial(materialName);
    else this.hideMaterial(materialName);
  }

  showMaterial(materialName) {
    this.configurator.showMaterial(materialName);
  }

  hideMaterial(materialName) {
    this.configurator.hideMaterial(materialName);
  }

  connectedCallback() {
    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot.appendChild(this.template.content);
    this.shadowRoot.append(this.style);
  }
}
window.customElements.define('model-viewer', ModelViewer);
