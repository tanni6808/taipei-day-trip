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
}
