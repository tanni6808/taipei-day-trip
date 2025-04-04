"use strict";

// POPUP
const btnSignUpInEl = document.getElementById("btn-signup-in");
const popupEl = document.querySelector(".popup");
const popupContainerEl = document.querySelector(".popup__container");
const btnPopupCloseEl = document.querySelector(".popup__container>.close");
const popupHintEl = document.querySelector(".popup__container>.hint");
const btnSwitchEl = document.getElementById("btn-switch-signup-in");

// INDEX
const mrtListEl = document.querySelector(".mrt__list");
const attractionsEl = document.querySelector(".attractions");
const footerEl = document.querySelector(".footer");
const searchFormEl = document.querySelector(".search");
const searchInputEl = document.querySelector(".search__input");
const btnScrollMrtL = document.querySelector(".mrt__container>.arrow-left");
const btnScrollMrtR = document.querySelector(".mrt__container>.arrow-right");

let nextPage = 0;
let attractionLastChildEl;
let searchKeyword = "";
if (attractionsEl) attractionsEl.innerHTML = "";

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
const sessionMorningEl = document.getElementById("session-morning");
const sessionAfternoonEl = document.getElementById("session-afternoon");
const sessionCostEl = document.getElementById("session-cost");

let currentSlideIndex = 0;
let sliderImgEls, sliderNavDotEls;

// COMMON - SIGN IN STATUS CHECK
window.onload = () => {
  fetch("/api/user/auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.data === null) {
        console.log("not sign in");
      } else {
        console.log("sign in");
        const navListEl = document.querySelector(".nav__list");
        const btnSignOutEl = document.createElement("li");
        btnSignOutEl.innerText = "登出系統";
        navListEl.removeChild(navListEl.lastElementChild);
        navListEl.appendChild(btnSignOutEl);
      }
    });
};

// COMMON - POPUP
btnSignUpInEl.addEventListener("click", () => {
  popupEl.classList.remove("hidden");
  const formEl = createFormEl("signin");
  popupContainerEl.insertBefore(formEl, popupHintEl);
  listenFormEl(formEl);
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
  // formEl.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   console.log("form submit");
  // });
});

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
    console.log(formEl.id);
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
        .then((data) => console.log(data));
    } else if (formEl.id === "signin") {
      console.log(formEl.querySelector("#email").value);
      // fetch("/api/user/auth", {
      //   method: "PUT",
      //   body: {
      //     email: formEl.querySelector("#email").value,
      //     password: formEl.querySelector("#password").value,
      //   },
      // })
      //   .then((response) => response.json)
      //   .then((data) => console.log(data));
    }
  });
};

// PAGE - INDEX
const initMrtList = async function () {
  let response = await fetch("/api/mrts");
  let data = await response.json();
  const mrts = data.data;
  mrts.forEach((mrt) => {
    const oneMrt = document.createElement("li");
    oneMrt.innerText = mrt;
    mrtListEl.appendChild(oneMrt);
  });
};

const getAttractionListAndRender = async function (page, keyword = "") {
  const url =
    keyword === ""
      ? `/api/attractions?page=${page}`
      : `/api/attractions?page=${page}&keyword=${keyword}`;
  let response = await fetch(url);
  let data = await response.json();
  if (data.data.length === 0) {
    return (attractionsEl.innerText =
      "查無相關景點資料！請使用其他關鍵字查詢。");
  }
  nextPage = data.nextPage;
  renderAttractions(data.data);
};

const renderAttractions = function (attractionArr) {
  attractionArr.forEach((attraction) => {
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
  attractionLastChildEl = attractionsEl.lastChild;
};

const obsCallback = function (entires, observer) {
  entires.forEach((entry) => {
    if (entry.isIntersecting && attractionLastChildEl) {
      if (nextPage === null) return observer.unobserve(footerEl);
      getAttractionListAndRender(nextPage, searchKeyword);
    }
  });
};

const obsOptions = {
  root: null, //entire viewport
  threshold: 0.1, //cover area threshold
};

const attractionLastChildObs = new IntersectionObserver(
  obsCallback,
  obsOptions
);

if (mrtListEl) {
  window.addEventListener("load", initMrtList);
  btnScrollMrtL.addEventListener("click", () => {
    mrtListEl.scrollLeft -= 330;
  });
  btnScrollMrtR.addEventListener("click", () => {
    mrtListEl.scrollLeft += 330;
  });

  mrtListEl.addEventListener("click", (e) => {
    const clickedMrtEl = e.target.closest("li");
    const clickedMrt = clickedMrtEl.innerText;
    searchInputEl.value = clickedMrt;
    searchFormEl.requestSubmit();
  });
}
if (attractionsEl) {
  window.addEventListener("load", () => {
    getAttractionListAndRender(0);
    attractionLastChildObs.observe(footerEl);
  });
}

if (searchFormEl) {
  searchFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    searchKeyword = searchInputEl.value;
    attractionsEl.innerHTML = "";
    attractionLastChildEl = attractionsEl.lastChild;
    getAttractionListAndRender(0, searchKeyword);
    attractionLastChildObs.observe(footerEl);
  });
}

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
