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
      handler(e.target);
    });
  }
}

export default new AttractionGalleryView();
