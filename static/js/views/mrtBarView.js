import View from "./view.js";

class MrtBarView extends View {
  parentElement = document.querySelector(".mrt__list");
  btnScrollToLeft = document.querySelector(".mrt__container>.arrow-right");
  btnScrollToRight = document.querySelector(".mrt__container>.arrow-left");

  generateHtmlStructureList() {
    let mrtLiElList = [];
    this.data.forEach((mrt) => {
      const mrtLiEl = document.createElement("li");
      mrtLiEl.innerText = mrt;
      mrtLiElList.push(mrtLiEl);
    });
    return mrtLiElList;
  }

  scrollTo(direction) {
    if (direction === "left") {
      this.parentElement.scrollLeft += 330;
    } else {
      this.parentElement.scrollLeft -= 330;
    }
  }

  addHandlerClickMrtLiEl(handler) {
    this.parentElement.addEventListener("click", (e) => {
      const clickedMrtEl = e.target.closest("li");
      if (!clickedMrtEl) return;
      handler(clickedMrtEl.innerText);
    });
  }
  addHandlerClickBtnScrollToLeft(handler) {
    this.btnScrollToLeft.addEventListener("click", handler);
  }
  addHandlerClickBtnScrollToRight(handler) {
    this.btnScrollToRight.addEventListener("click", handler);
  }
}

export default new MrtBarView();
