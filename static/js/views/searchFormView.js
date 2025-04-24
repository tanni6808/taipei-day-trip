class SearchFormView {
  parentElement = document.getElementById("search");

  fillInput(input) {
    this.parentElement.querySelector(".search__input").value = input;
  }

  getKeyword() {
    const keyword = this.parentElement.querySelector(".search__input").value;
    return keyword;
  }

  clearInput() {
    this.parentElement.querySelector(".search__input").value = "";
  }

  addHandlerSearch(handler) {
    this.parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(this.getKeyword());
    });
  }
}

export default new SearchFormView();
