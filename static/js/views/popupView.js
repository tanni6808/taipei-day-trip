import View from "./view.js";

class PopupView extends View {
  parentElement = document.querySelector(".popup__container");
  overlayEl = document.querySelector(".popup");
  titleEl = document.querySelector(".popup__container>h3");
  formEl = null;
  defaultHintEl = document.querySelector(".popup__container>.hint");
  btnSwitchEl = document.createElement("span");

  showPopup() {
    this.overlayEl.classList.remove("hidden");
  }
  hidePopup() {
    this.overlayEl.classList.add("hidden");
  }

  renderFormEl() {
    this.parentElement.insertBefore(this.formEl, this.defaultHintEl);
  }

  removeFormEl() {
    this.parentElement.removeChild(this.parentElement.querySelector("form"));
    if (this.parentElement.lastElementChild.lastElementChild === null) {
      this.parentElement.removeChild(this.parentElement.lastElementChild);
    }
  }

  generateFormEl(formType) {
    const formEl = document.createElement("form");
    formEl.id = formType;
    const inputEmailEl = document.createElement("input");
    inputEmailEl.type = "email";
    inputEmailEl.id = "email";
    inputEmailEl.placeholder = "輸入電子信箱";
    inputEmailEl.required = true;
    const inputPaswordEl = document.createElement("input");
    inputPaswordEl.type = "password";
    inputPaswordEl.id = "password";
    inputPaswordEl.placeholder = "輸入密碼";
    inputPaswordEl.required = true;
    const btnSubmitEl = document.createElement("button");
    btnSubmitEl.type = "submit";
    formEl.append(inputEmailEl, inputPaswordEl, btnSubmitEl);
    if (formType === "signup") {
      this.titleEl.innerText = "註冊會員帳號";
      this.btnSwitchEl.innerText = "點此登入";
      this.defaultHintEl.innerHTML = "";
      this.defaultHintEl.append("已經有帳戶了？", this.btnSwitchEl);
      btnSubmitEl.innerText = "註冊新帳戶";
      const inputNameEl = document.createElement("input");
      inputNameEl.type = "text";
      inputNameEl.id = "name";
      inputNameEl.placeholder = "輸入姓名";
      inputNameEl.required = true;
      formEl.prepend(inputNameEl);
      this.formEl = formEl;
      return;
    }
    this.titleEl.innerText = "登入會員帳號";
    this.btnSwitchEl.innerText = "點此註冊";
    this.defaultHintEl.innerHTML = "";
    this.defaultHintEl.append("還沒有帳戶？", this.btnSwitchEl);
    btnSubmitEl.innerText = "登入帳戶";
    this.formEl = formEl;
  }

  renderNewHint(message) {
    if (this.parentElement.lastElementChild.lastElementChild === null) {
      this.parentElement.removeChild(this.parentElement.lastElementChild);
    }
    const newHintEl = document.createElement("div");
    newHintEl.classList.add("hint", "bold");
    newHintEl.innerText = message.toString().startsWith("Error: ")
      ? message.toString().slice(7)
      : message.toString();
    this.parentElement.appendChild(newHintEl);
  }

  addHandlerRenderForm(handler) {
    handler();
  }

  addHandlerClickBtnSwitch(handler) {
    this.btnSwitchEl.addEventListener("click", handler);
  }

  addHandlerSubmitForm(handler) {
    this.parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(e.target.id);
    });
  }

  addHandlerClickClose(handler) {
    this.overlayEl.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("popup") ||
        e.target.classList.contains("close")
      ) {
        handler();
      }
    });
  }
}

export default new PopupView();
