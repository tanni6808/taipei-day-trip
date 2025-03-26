"use strict";

// INDEX
const mrtListEl = document.querySelector(".mrt__list");
const attractionsEl = document.querySelector(".attractions");
const footerEl = document.querySelector(".footer");
const searchFormEl = document.querySelector(".search");
const searchInputEl = document.querySelector(".search__input");
const btnScrollMrtL = document.querySelector(".arrow--left");
const btnScrollMrtR = document.querySelector(".arrow--right");

let nextPage = 0;
let attractionLastChildEl;
let searchKeyword = "";
// attractionsEl.innerHTML = "";

// ATTRACTION
const sliderEl = document.querySelector(".attraction__slider");
const sliderImgEls = sliderEl?.querySelectorAll("img");
const btnScrollSliderL = document
  .querySelector(".attraction__gallery")
  ?.querySelector(".arrow--left");
const btnScrollSliderR = document
  .querySelector(".attraction__gallery")
  ?.querySelector(".arrow--right");
const sliderNavDotEls = document
  .querySelector(".attraction__slider-nav")
  ?.querySelectorAll(".dot");
const sessionChooseEls = document.querySelectorAll(
  ".form__radio-container.session-choose"
);
const sessionMorningEl = document.getElementById("session-morning");
const sessionAfternoonEl = document.getElementById("session-afternoon");
const sessionCostEl = document.getElementById("session-cost");

let currentSlideIndex = 0;
let totalSlides = sliderImgEls?.length;

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
    const aCardEl = document.createElement("div");
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
const goToSlide = function (index) {
  const goToSlideIndex = (index + totalSlides) % totalSlides;
  sliderNavDotEls.forEach((dot) => dot.classList.remove("active"));
  sliderNavDotEls[goToSlideIndex].classList.add("active");
  sliderEl.scrollTo({ left: sliderImgEls[0].clientWidth * goToSlideIndex });
};

if (sliderEl) {
  btnScrollSliderL.addEventListener("click", (e) => {
    currentSlideIndex--;
    goToSlide(currentSlideIndex);
  });

  btnScrollSliderR.addEventListener("click", (e) => {
    currentSlideIndex++;
    goToSlide(currentSlideIndex);
  });

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
