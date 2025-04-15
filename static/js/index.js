"use strict";

const btnBookingEl = document.getElementById("btn-booking");
const popupEl = document.querySelector(".popup");
const attractionsEl = document.querySelector(".attractions");
const footerEl = document.querySelector(".footer");
const searchFormEl = document.getElementById("search");
const searchInputEl = document.querySelector(".search__input");
const navListEl = document.querySelector(".nav__list");

// Model
const accountModel = {
  async fetchSignUp(formEl) {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formEl.querySelector("#name").value,
        email: formEl.querySelector("#email").value,
        password: formEl.querySelector("#password").value,
      }),
    });
    const data = await response.json();
    return data;
  },
  async fetchSignIn(formEl) {
    const response = await fetch("/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formEl.querySelector("#email").value,
        password: formEl.querySelector("#password").value,
      }),
    });
    const data = await response.json();
    return data;
  },
};

const userStatusModel = {
  async fetchUserStatus() {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: "Bearer " + token } : {};
    const response = await fetch("/api/user/auth", {
      headers,
    });
    return response.json();
  },
};
const mrtModel = {
  async fetchMrtList() {
    try {
      const response = await fetch("/api/mrts");
      const data = await response.json();
      if (data.error) throw new Error(data.message);
      return data.data;
    } catch (err) {
      console.error("Model", err);
      throw err;
    }
  },
};
const attractionModel = {
  async fetchAttractionData(page, keyword = "") {
    const url =
      keyword === ""
        ? `/api/attractions?page=${page}`
        : `/api/attractions?page=${page}&keyword=${keyword}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) throw new Error(data.message);
      return data;
    } catch (err) {
      console.error("Model", err);
      throw err;
    }
  },
};

// View
const navView = {
  btnSignUpInEl: null,
  btnSignOutEl: null,
  renderSignUpInBtn() {
    this.btnSignUpInEl = document.createElement("li");
    this.btnSignUpInEl.innerText = "登入/註冊";
    navListEl.appendChild(this.btnSignUpInEl);
  },
  renderSignoutBtn() {
    this.btnSignOutEl = document.createElement("li");
    this.btnSignOutEl.innerText = "登出系統";
    navListEl.appendChild(this.btnSignOutEl);
  },
  bindBtnSignUpInClick(handler) {
    this.btnSignUpInEl.addEventListener("click", handler);
  },
  bindBtnSignOutClick(handler) {
    this.btnSignOutEl.addEventListener("click", handler);
  },
  bindBtnBookingClick(handler) {
    btnBookingEl.addEventListener("click", handler);
  },
};

const popupView = {
  formEl: null,
  btnCloseEl: document.querySelector(".popup__container>.close"),
  containerEl: document.querySelector(".popup__container"),
  titleEl: document.querySelector(".popup__container>h3"),
  hintEl: document.querySelector(".popup__container>.hint"),
  btnSwitchEl: document.getElementById("btn-switch-signup-in"),
  showPopup() {
    popupEl.classList.remove("hidden");
  },
  closePopup() {
    popupEl.classList.add("hidden");
  },
  createForm(formType) {
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
    btnSubmitEl.innerText = "登入帳戶";
    this.formEl = formEl;
  },
  renderForm() {
    if (this.containerEl.querySelector("form") !== null) {
      this.containerEl.removeChild(this.containerEl.querySelector("form"));
    }
    this.containerEl.insertBefore(this.formEl, this.hintEl);
  },
  changeDefaultHint() {
    this.hintEl.innerHTML = "";
    const formType = this.formEl.id;
    if (formType === "signup") {
      this.btnSwitchEl.innerText = "點此登入";
      this.hintEl.append("已經有帳戶了？", this.btnSwitchEl);
    } else {
      this.btnSwitchEl.innerText = "點此註冊";
      this.hintEl.append("還沒有帳戶？", this.btnSwitchEl);
    }
  },
  renderNewHint(message) {
    this.clearNewHint();
    const newHintEl = document.createElement("div");
    newHintEl.classList.add("hint", "bold");
    newHintEl.innerText = message;
    this.containerEl.appendChild(newHintEl);
  },
  clearNewHint() {
    if (this.containerEl.lastElementChild.lastElementChild === null) {
      this.containerEl.removeChild(this.containerEl.lastElementChild);
    }
  },
  bindBtnCloseClick(handler) {
    this.btnCloseEl.addEventListener("click", handler);
  },
  bindBtnSwitchClick(handler) {
    this.btnSwitchEl.addEventListener("click", handler);
  },
  bindFormSubmit(handler) {
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  },
};

const searchFormView = {
  getKeyword() {
    return searchInputEl.value;
  },
  setKeyword(keyword) {
    searchInputEl.value = keyword;
  },
  clearKeyword() {
    searchInputEl.value = "";
  },
  bindSearchFormSubmit(handler) {
    searchFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(searchInputEl.value);
    });
  },
};

const mrtView = {
  renderMrtBar(mrtList) {
    const mrtBarEl = document.querySelector(".mrt__list");
    mrtList.forEach((mrt) => {
      const mrtLiEl = document.createElement("li");
      mrtLiEl.innerText = mrt;
      mrtBarEl.appendChild(mrtLiEl);
    });
  },
  leftScrollMrtBar() {
    document.querySelector(".mrt__list").scrollLeft -= 330;
  },
  rightScrollMrtBar() {
    document.querySelector(".mrt__list").scrollLeft += 330;
  },
  bindBtnLClick(handler) {
    document
      .querySelector(".mrt__container>.arrow-left")
      .addEventListener("click", handler);
  },
  bindBtnRClick(handler) {
    document
      .querySelector(".mrt__container>.arrow-right")
      .addEventListener("click", handler);
  },
  bindMrtLiClick(handler) {
    document.querySelector(".mrt__list").addEventListener("click", (e) => {
      const clickedMrtEl = e.target.closest("li");
      handler(clickedMrtEl.innerText);
    });
  },
};

const attractionView = {
  renderAttractionCards(attractionList) {
    attractionList.forEach((attraction) => {
      const aCardEl = document.createElement("a");
      aCardEl.href = `./attraction/${attraction.id}`;
      aCardEl.classList.add("attraction-card");
      const aImgEl = document.createElement("div");
      aImgEl.classList.add("attraction-card__image");
      aImgEl.style.backgroundImage = `url(${attraction.images[0]})`;
      const aNameEl = document.createElement("div");
      aNameEl.classList.add("attraction-card__name");
      aNameEl.innerText = attraction.name;
      aImgEl.appendChild(aNameEl);
      const aDetailEl = document.createElement("div");
      aDetailEl.classList.add("attraction-card__details");
      const aDetailMrtEl = document.createElement("div");
      aDetailMrtEl.innerText = attraction.mrt;
      const aDetailCategoryEl = document.createElement("div");
      aDetailCategoryEl.innerText = attraction.category;
      aDetailEl.append(aDetailMrtEl, aDetailCategoryEl);
      aCardEl.append(aImgEl, aDetailEl);
      attractionsEl.appendChild(aCardEl);
    });
  },
  renderErrorMessage(message) {
    attractionsEl.innerText = message;
  },
  clearAttractionCards() {
    attractionsEl.innerHTML = "";
  },
};

// Controller
const navController = {
  async init() {
    const userStatus = await userStatusModel.fetchUserStatus();
    if (userStatus.data === null) {
      navView.renderSignUpInBtn();
      navView.bindBtnSignUpInClick(this.handleBtnSignUpInClick);
      navView.bindBtnBookingClick(popupView.showPopup);
    } else {
      navView.renderSignoutBtn();
      navView.bindBtnSignOutClick(this.handleBtnSignOutClick);
      navView.bindBtnBookingClick(function () {
        window.location.href = "/booking";
      });
    }
  },
  handleBtnSignUpInClick() {
    popupView.showPopup();
  },
  handleBtnSignOutClick() {
    localStorage.removeItem("token");
    location.reload();
  },
};
const popupController = {
  init() {
    popupView.bindBtnCloseClick(this.handleBtnCloseClick);
    popupView.createForm("signin");
    popupView.renderForm();
    popupView.bindBtnSwitchClick(this.handleBtnSwitchClick);
    popupView.bindFormSubmit(this.handleFormSubmit);
  },
  handleBtnCloseClick() {
    popupView.closePopup();
  },
  handleBtnSwitchClick() {
    popupView.clearNewHint();
    if (popupView.formEl.id === "signup") {
      popupView.createForm("signin");
      popupView.renderForm();
    } else {
      popupView.createForm("signup");
      popupView.renderForm();
    }
    popupView.changeDefaultHint();
    popupView.bindFormSubmit(popupController.handleFormSubmit);
  },
  async handleFormSubmit() {
    if (popupView.formEl.id === "signup") {
      const result = await accountModel.fetchSignUp(popupView.formEl);
      if (result.ok) {
        popupView.renderNewHint("註冊成功！");
      } else if (result.error) {
        popupView.renderNewHint(result.message);
      }
    } else {
      const result = await accountModel.fetchSignIn(popupView.formEl);
      if (!result.error) {
        localStorage.setItem("token", result.token);
        location.reload();
      } else {
        popupView.renderNewHint(result.message);
      }
    }
  },
};

const mrtBarController = {
  async init() {
    try {
      const mrtList = await mrtModel.fetchMrtList();
      mrtView.renderMrtBar(mrtList);
    } catch (err) {
      handleError(err);
    }
    mrtView.bindBtnLClick(mrtView.leftScrollMrtBar);
    mrtView.bindBtnRClick(mrtView.rightScrollMrtBar);
    mrtView.bindMrtLiClick(this.handleMrtLiClick);
  },
  handleMrtLiClick(clickedMrtLiEl) {
    searchFormView.setKeyword(clickedMrtLiEl);
    attractionSectionController.handleSearchFormSubmit(clickedMrtLiEl);
  },
};

const attractionSectionController = {
  nextPage: 0,
  keyword: "",
  isLoading: false,
  observer: null,
  obsOption: {
    root: null, //entire viewport
    threshold: 0.1, //cover area threshold
  },
  async init() {
    attractionView.clearAttractionCards();
    searchFormView.bindSearchFormSubmit(this.handleSearchFormSubmit.bind(this));
    this.observer = new IntersectionObserver(
      this.obsCallback.bind(this),
      this.obsOption
    );
    this.loadMoreAttractionCards(this.nextPage, this.keyword).then(() => {
      this.observer.observe(footerEl);
    });
  },
  async loadMoreAttractionCards(nextPage, keyword = "") {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const attractionData = await attractionModel.fetchAttractionData(
        nextPage,
        keyword
      );
      const attractionList = attractionData.data;
      this.nextPage = attractionData.nextPage;
      if (attractionList.length === 0) {
        return attractionView.renderErrorMessage(
          "查無相關景點資料！請使用其他關鍵字查詢。"
        );
      }
      attractionView.renderAttractionCards(attractionList);
    } catch (err) {
      handleError(err);
    } finally {
      this.isLoading = false;
    }
  },
  obsCallback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (this.nextPage === null) return observer.unobserve(footerEl);
        else this.loadMoreAttractionCards(this.nextPage, this.keyword);
      }
    });
  },
  async handleSearchFormSubmit(keyword) {
    this.keyword = keyword;
    this.nextPage = 0;
    attractionView.clearAttractionCards();
    this.loadMoreAttractionCards(this.nextPage, this.keyword).then(() =>
      this.observer.observe(footerEl)
    );
  },
};

const handleError = function (err) {
  console.log("還沒決定怎麼處理", err);
};

navController.init();
popupController.init();
mrtBarController.init();
attractionSectionController.init();
