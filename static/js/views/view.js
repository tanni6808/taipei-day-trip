export default class View {
  data;
  render(data, keepCurrentEl = false) {
    this.data = data;
    if (!keepCurrentEl) this.clear();
    const htmlStructureList = this.generateHtmlStructureList();
    this.parentElement.append(...htmlStructureList);
  }
  renderLoader() {
    // TODO
  }
  renderError(message) {
    // TODO
  }
  clear() {
    this.parentElement.innerHTML = "";
  }

  addHandlerRender(handler) {
    handler();
  }
  createElWithClasses(tag, classes) {
    const el = document.createElement(tag);
    el.classList.add(...classes);
    return el;
  }
  setAttributes(el, attributes) {
    for (let key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  }
}
