import View from "./view.js";

class IndexAttractionView extends View {
  parentElement = document.querySelector(".attractions");

  generateHtmlStructureList() {
    let attractionCardElList = [];
    this.data.forEach((attraction) => {
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
      attractionCardElList.push(aCardEl);
    });
    return attractionCardElList;
  }

  addHandlerTouchFooter(handler) {
    const footerEl = document.querySelector("footer");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const attractionCardElList =
            document.querySelectorAll(".attraction-card");
          if (entry.isIntersecting && attractionCardElList.length !== 0)
            handler();
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
    observer.observe(footerEl);
  }
}

export default new IndexAttractionView();
