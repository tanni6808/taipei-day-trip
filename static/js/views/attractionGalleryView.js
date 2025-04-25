import View from "./view.js";

class AttractionGalleryView extends View {
  parentElement = document.querySelector(".attraction__gallery");

  generateHtmlStructureList() {
    const imageSliderParentEl = document.createElement("div");
    imageSliderParentEl.classList.add("attraction__slider");
    this.data.images.forEach((image) => {
      const imageSlider = document.createElement("img");
      imageSlider.src = image;
      imageSliderParentEl.appendChild(imageSlider);
    });

    if (this.data.images.length === 1) {
      return [imageSliderParentEl]; // don't render arrows & dots when there's only one image
    }

    const btnArrowLeftEl = document.createElement("div");
    btnArrowLeftEl.classList.add("arrow", "arrow-left");

    const btnArrowRightEl = document.createElement("div");
    btnArrowRightEl.classList.add("arrow", "arrow-right");

    const imageSliderNavParentEl = document.createElement("div");
    imageSliderNavParentEl.classList.add("attraction__slider-nav");
    for (let i = 0; i < this.data.images.length; i++) {
      const dot = document.createElement("div");
      if (i === 0) dot.classList.add("active");
      dot.classList.add("dot");
      imageSliderNavParentEl.appendChild(dot);
    }

    return [
      btnArrowLeftEl,
      imageSliderParentEl,
      btnArrowRightEl,
      imageSliderNavParentEl,
    ];
  }

  addHandlerClickBtnArrow(handler) {
    this.parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("arrow")) {
        const direction = e.target.classList.contains("arrow-left")
          ? "prev"
          : "next";
        handler(direction);
      }
    });
  }

  addHandlerClickNavDot(handler) {
    this.parentElement.addEventListener("click", (e) => {
      if (e.target.classList.contains("dot")) {
        const dotIndex = Array.prototype.indexOf.call(
          this.parentElement.querySelectorAll(".dot"),
          e.target
        );
        handler(dotIndex);
      }
    });
  }

  sliderScrollTo(index) {
    const sliderNavDotElList = this.parentElement.querySelectorAll(".dot");
    const sliderEl = this.parentElement.querySelector(".attraction__slider");
    const sliderImgElList = sliderEl.querySelectorAll("img");
    sliderNavDotElList.forEach((dot) => dot.classList.remove("active"));
    sliderNavDotElList[index].classList.add("active");
    sliderEl.scrollTo({ left: sliderImgElList[0].clientWidth * index });
  }

  sliderResizeWithWidth(index) {
    const sliderEl = this.parentElement.querySelector(".attraction__slider");
    sliderEl.scrollTo({
      left: sliderEl.clientWidth * index,
      behavior: "instant",
    });
  }
}

export default new AttractionGalleryView();
