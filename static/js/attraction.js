"use strict";

// POPUP
const btnSignUpInEl = document.getElementById("btn-signup-in");
const btnBookingEl = document.getElementById("btn-booking");
const popupEl = document.querySelector(".popup");
const popupContainerEl = document.querySelector(".popup__container");
const btnPopupCloseEl = document.querySelector(".popup__container>.close");
const popupHintEl = document.querySelector(".popup__container>.hint");
const btnSwitchEl = document.getElementById("btn-switch-signup-in");

// ATTRACTION
const pathParts = window.location.pathname.split("/");
const attractionID = pathParts[pathParts.length - 1];
const sliderEl = document.querySelector(".attraction__slider");
const btnScrollSliderL = document
  .querySelector(".attraction__gallery")
  ?.querySelector(".arrow-left");
const btnScrollSliderR = document
  .querySelector(".attraction__gallery")
  ?.querySelector(".arrow-right");
const sliderNavEl = document.querySelector(".attraction__slider-nav");
const sessionChooseEls = document.querySelectorAll(
  ".form__radio-container.session-choose"
);
const formReservationEl = document.getElementById(
  "attraction__reservation-form"
);
const sessionMorningEl = document.getElementById("session-morning");
const sessionAfternoonEl = document.getElementById("session-afternoon");
const sessionCostEl = document.getElementById("session-cost");

let currentSlideIndex = 0;
let sliderImgEls, sliderNavDotEls;

// COMMON - SIGN IN STATUS CHECK
window.onload = () => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  fetch("/api/user/auth", {
    headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data !== null) {
        const navListEl = document.querySelector(".nav__list");
        const btnSignOutEl = document.createElement("li");
        btnSignOutEl.innerText = "登出系統";
        btnSignOutEl.addEventListener("click", () => {
          localStorage.removeItem("token");
          location.reload();
        });
        navListEl.removeChild(navListEl.lastElementChild);
        navListEl.appendChild(btnSignOutEl);

        btnBookingEl.addEventListener("click", () => {
          window.location.href = "/booking";
        });
        if (formReservationEl) {
          formReservationEl.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log(
              formReservationEl.querySelector("#session-cost").innerText
            );
            fetch("/api/booking", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                attractionId: attractionID,
                date: formReservationEl.querySelector("#date").value,
                time:
                  formReservationEl.querySelector("#session-morning")
                    .checked === true
                    ? "morning"
                    : "afternoon",
                price:
                  formReservationEl.querySelector("#session-cost").innerText,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (data.ok) {
                  window.location.href = "/booking";
                }
              });
          });
        }
      } else {
        btnBookingEl.addEventListener("click", () => {
          popupEl.classList.remove("hidden");
          if (popupContainerEl.querySelector("form") === null) {
            const formEl = createFormEl("signin");
            popupContainerEl.insertBefore(formEl, popupHintEl);
            listenFormEl(formEl);
          }
          if (popupContainerEl.lastElementChild.lastElementChild === null) {
            popupContainerEl.removeChild(popupContainerEl.lastElementChild);
          }
        });
        if (formReservationEl) {
          formReservationEl.addEventListener("submit", (e) => {
            e.preventDefault();
            popupEl.classList.remove("hidden");
            if (popupContainerEl.querySelector("form") === null) {
              const formEl = createFormEl("signin");
              popupContainerEl.insertBefore(formEl, popupHintEl);
              listenFormEl(formEl);
            }
            if (popupContainerEl.lastElementChild.lastElementChild === null) {
              popupContainerEl.removeChild(popupContainerEl.lastElementChild);
            }
          });
        }
      }
    });
};

// COMMON - POPUP
if (popupEl) {
  btnSignUpInEl.addEventListener("click", () => {
    popupEl.classList.remove("hidden");
    if (popupContainerEl.querySelector("form") === null) {
      const formEl = createFormEl("signin");
      popupContainerEl.insertBefore(formEl, popupHintEl);
      listenFormEl(formEl);
    }
    if (popupContainerEl.lastElementChild.lastElementChild === null) {
      popupContainerEl.removeChild(popupContainerEl.lastElementChild);
    }
  });

  btnPopupCloseEl.addEventListener("click", () => {
    popupEl.classList.add("hidden");
  });

  btnSwitchEl.addEventListener("click", () => {
    let formEl;
    if (popupEl.querySelector("form").id === "signin") {
      popupEl.querySelector("h3").innerText = "註冊會員帳號";
      popupContainerEl.removeChild(popupContainerEl.querySelector("form"));
      formEl = createFormEl("signup");
      btnSwitchEl.innerText = "點此登入";
      popupHintEl.innerHTML = "";
      popupHintEl.append("已經有帳戶了？", btnSwitchEl);
    } else {
      popupEl.querySelector("h3").innerText = "登入會員帳號";
      popupContainerEl.removeChild(popupContainerEl.querySelector("form"));
      formEl = createFormEl("signin");
      btnSwitchEl.innerText = "點此註冊";
      popupHintEl.innerHTML = "";
      popupHintEl.append("還沒有帳戶？", btnSwitchEl);
    }
    popupContainerEl.insertBefore(formEl, popupHintEl);
    listenFormEl(formEl);
    if (popupContainerEl.lastElementChild.lastElementChild === null) {
      popupContainerEl.removeChild(popupContainerEl.lastElementChild);
    }
  });
}

const createFormEl = function (type) {
  const formEl = document.createElement("form");
  formEl.id = type;
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
  if (type === "signup") {
    btnSubmitEl.innerText = "註冊新帳戶";
    const inputNameEl = document.createElement("input");
    inputNameEl.type = "text";
    inputNameEl.id = "name";
    inputNameEl.placeholder = "輸入姓名";
    inputNameEl.required = true;
    formEl.prepend(inputNameEl);
    return formEl;
  }
  btnSubmitEl.innerText = "登入帳戶";
  return formEl;
};

const listenFormEl = function (formEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formEl.id === "signup") {
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formEl.querySelector("#name").value,
          email: formEl.querySelector("#email").value,
          password: formEl.querySelector("#password").value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            renderPopupMessage("註冊成功！");
          } else if (data.error) {
            renderPopupMessage(data.message);
          }
        });
    } else if (formEl.id === "signin") {
      fetch("/api/user/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formEl.querySelector("#email").value,
          password: formEl.querySelector("#password").value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            localStorage.setItem("token", data.token);
            location.reload();
          } else renderPopupMessage(data.message);
        });
    }
  });
};

const renderPopupMessage = function (message) {
  if (popupContainerEl.lastElementChild.lastElementChild === null) {
    popupContainerEl.removeChild(popupContainerEl.lastElementChild);
  }
  const popupMsgEl = document.createElement("div");
  popupMsgEl.classList.add("hint", "bold");
  popupMsgEl.innerText = message;
  popupContainerEl.appendChild(popupMsgEl);
};

// PAGE - ATTRACTION
const getOneAttractionAndRender = async function (id) {
  try {
    let response = await fetch(`/api/attraction/${id}`);
    if (!response.ok)
      throw new Error(`找不到景點(${response.status} ${response.statusText})`);
    let data = await response.json();
    const attractionData = data.data;
    renderOneAttraction(attractionData);
  } catch (err) {
    // console.log(err);
    document.querySelector("section.attraction").innerHTML = "";
    document.querySelector("section.attraction").textContent = err;
  }
};

const renderOneAttraction = function (attractionData) {
  document.querySelector(".attraction__info>h3").textContent =
    attractionData.name;
  document.querySelector(".attraction__sub").textContent =
    attractionData.mrt === "無"
      ? attractionData.category
      : attractionData.category + " at " + attractionData.mrt;
  const attractionParagraphEls = document.querySelectorAll(
    ".attraction__body>p"
  );
  attractionParagraphEls[0].textContent = attractionData.description;
  attractionParagraphEls[1].textContent = attractionData.address;
  attractionParagraphEls[2].textContent = attractionData.transport;

  // SLIDERS
  sliderEl.innerHTML = "";
  sliderNavEl.innerHTML = "";
  attractionData.images.forEach((image) => {
    const imageSlider = document.createElement("img");
    imageSlider.src = image;
    sliderEl.appendChild(imageSlider);
  });
  // don't render arrows & dots when there's only one image
  if (attractionData.images.length === 1) {
    document
      .querySelectorAll(".attraction__gallery>.arrow")
      .forEach((node) => node.remove());
    return;
  }
  sliderImgEls = sliderEl.querySelectorAll("img");
  for (let i = 0; i < sliderImgEls.length; i++) {
    const dot = document.createElement("div");
    if (i === 0) dot.classList.add("active");
    dot.classList.add("dot");
    sliderNavEl.appendChild(dot);
  }
  sliderNavDotEls = sliderNavEl.querySelectorAll(".dot");
  sliderNavDotEls.forEach((el) => {
    el.addEventListener("click", (e) => {
      sliderNavDotEls.forEach((dot) => dot.classList.remove("active"));
      e.target.classList.add("active");
      currentSlideIndex = Array.prototype.indexOf.call(
        sliderNavDotEls,
        e.target
      );
      goToSlide(currentSlideIndex);
    });
  });
};

const goToSlide = function (index) {
  // let totalSlides = sliderImgEls.length;
  // const goToSlideIndex = (index + totalSlides) % totalSlides;
  sliderNavDotEls.forEach((dot) => dot.classList.remove("active"));
  sliderNavDotEls[index].classList.add("active");
  sliderEl.scrollTo({ left: sliderImgEls[0].clientWidth * index });
};

if (pathParts[1] === "attraction") {
  getOneAttractionAndRender(attractionID);
}

if (sliderEl) {
  btnScrollSliderL.addEventListener("click", () => {
    let totalSlides = sliderImgEls.length;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlideIndex);
  });

  btnScrollSliderR.addEventListener("click", () => {
    let totalSlides = sliderImgEls.length;
    currentSlideIndex = (currentSlideIndex + 1 + totalSlides) % totalSlides;
    goToSlide(currentSlideIndex);
  });

  window.addEventListener("resize", () => {
    sliderEl.scrollTo({
      left: sliderEl.clientWidth * currentSlideIndex,
      behavior: "instant",
    });
  });
}

if (sessionChooseEls.length > 0) {
  sessionChooseEls.forEach((el) => {
    el.addEventListener("click", (e) => {
      const checkedSessionEl = e.target.closest("div").querySelector("input");
      checkedSessionEl.checked = true;
      if (checkedSessionEl === sessionAfternoonEl) {
        sessionCostEl.textContent = "2500";
      } else {
        sessionCostEl.textContent = "2000";
      }
    });
  });
}

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

const attractionModel = {
  async fetchAttraction(id) {},
};

// View
const navView = {
  navListEl: document.querySelector(".nav__list"),
  btnSignUpInEl: null,
  btnSignOutEl: null,
  btnBookingEl: document.getElementById("btn-booking"),
  renderSignUpInBtn() {
    this.btnSignUpInEl = document.createElement("li");
    this.btnSignUpInEl.innerText = "登入/註冊";
    this.navListEl.appendChild(this.btnSignUpInEl);
  },
  renderSignoutBtn() {
    this.btnSignOutEl = document.createElement("li");
    this.btnSignOutEl.innerText = "登出系統";
    this.navListEl.appendChild(this.btnSignOutEl);
  },
  bindBtnSignUpInClick(handler) {
    this.btnSignUpInEl.addEventListener("click", handler);
  },
  bindBtnSignOutClick(handler) {
    this.btnSignOutEl.addEventListener("click", handler);
  },
  bindBtnBookingClick(handler) {
    this.btnBookingEl.addEventListener("click", handler);
  },
};

const popupView = {
  popupEl: document.querySelector(".popup"),
  containerEl: document.querySelector(".popup__container"),
  btnCloseEl: document.querySelector(".popup__container>.close"),
  titleEl: document.querySelector(".popup__container>h3"),
  formEl: null,
  btnSwitchEl: document.getElementById("btn-switch-signup-in"),
  hintEl: document.querySelector(".popup__container>.hint"),
  showPopup() {
    this.popupEl.classList.remove("hidden");
  },
  closePopup() {
    this.popupEl.classList.add("hidden");
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
  searchFormEl: document.getElementById("search"),
  searchInputEl: document.querySelector(".search__input"),
  getKeyword() {
    return this.searchInputEl.value;
  },
  setKeyword(keyword) {
    this.searchInputEl.value = keyword;
  },
  clearKeyword() {
    this.searchInputEl.value = "";
  },
  bindSearchFormSubmit(handler) {
    this.searchFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(this.searchInputEl.value);
    });
  },
};

const imageSliderView = {
  renderSlider() {},
  renderNavDots() {},
  renderBtnPrevNext() {},
};

const attractionDetailView = {
  renderAttractionDetail() {},
};

// Controller
const navController = {
  async init() {
    const userStatus = await userStatusModel.fetchUserStatus();
    if (userStatus.data === null) {
      navView.renderSignUpInBtn();
      navView.bindBtnSignUpInClick(this.handleBtnSignUpInClick);
      navView.bindBtnBookingClick(this.handleBtnBookingClick);
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
  handleBtnBookingClick() {
    popupView.showPopup();
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

navController.init();
popupController.init();
