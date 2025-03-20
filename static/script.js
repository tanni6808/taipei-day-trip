"use strict";

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
attractionsEl.innerHTML = "";

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
  nextPage = data.nextPage;
  renderAttractions(data.data);
};

const renderAttractions = function (attractionArr) {
  attractionArr.forEach((attraction) => {
    const aCardEl = document.createElement("div");
    aCardEl.classList.add("attraction__card");
    const aImgEl = document.createElement("div");
    aImgEl.classList.add("attraction__image");
    aImgEl.style.backgroundImage = `url(${attraction.images[0]})`;
    const aNameEl = document.createElement("div");
    aNameEl.classList.add("attraction__name");
    aNameEl.innerText = attraction.name;
    aImgEl.appendChild(aNameEl);
    const aDetailEl = document.createElement("div");
    aDetailEl.classList.add("attraction__details");
    const aDetailMrtEl = document.createElement("div");
    aDetailMrtEl.classList.add("a-detail__mrt");
    aDetailMrtEl.innerText = attraction.mrt;
    const aDetailCategoryEl = document.createElement("div");
    aDetailCategoryEl.classList.add("a-detail__category");
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

window.addEventListener("load", initMrtList);
window.addEventListener("load", () => {
  getAttractionListAndRender(0);
  attractionLastChildObs.observe(footerEl);
});

searchFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  searchKeyword = searchInputEl.value;
  attractionsEl.innerHTML = "";
  attractionLastChildEl = attractionsEl.lastChild;
  getAttractionListAndRender(0, searchKeyword);
  attractionLastChildObs.observe(footerEl);
});

btnScrollMrtL.addEventListener("click", () => {
  mrtListEl.scrollLeft -= 500;
});
btnScrollMrtR.addEventListener("click", () => {
  mrtListEl.scrollLeft += 500;
});
