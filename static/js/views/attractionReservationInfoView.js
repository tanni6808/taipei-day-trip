import View from "./view.js";

class AttractionReservationInfoView extends View {
  parentElement = document.querySelector(".attraction__info");

  addHandlerClickTime(handler) {
    this.parentElement.addEventListener("click", (e) => {
      const clickedTimeEl = e.target
        .closest(".session-choose")
        ?.querySelector("input");
      if (clickedTimeEl === undefined) return;
      handler(clickedTimeEl.id);
    });
  }

  addHandlerSubmitForm(handler) {
    this.parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      handler(e.target);
    });
  }

  checkTime(id) {
    this.parentElement.querySelector(`#${id}`).checked = true;
  }

  changePrice(id) {
    this.parentElement.querySelector("#session-cost").innerText =
      id === "session-afternoon" ? "2500" : "2000";
  }

  generateHtmlStructureList() {
    const attractionTitleEl = document.createElement("h3");
    attractionTitleEl.innerText = this.data.name;
    const attractionSubTitleEl = this.createElWithClasses("div", [
      "attraction__sub",
    ]);
    attractionSubTitleEl.innerText = `${this.data.category} at ${this.data.mrt}`;
    const attractionResEl = this.createElWithClasses("div", [
      "attraction__reservation",
    ]);

    const resFormEl = this.createElWithClasses("form", [
      "attraction__reservation-form",
    ]);
    resFormEl.id = "attraction__reservation-form";

    const resFormTitle = this.createElWithClasses("div", ["form", "bold"]);
    resFormTitle.innerText = "訂購導覽行程";

    const resFormSubTitle = this.createElWithClasses("div", ["form"]);
    resFormSubTitle.innerText =
      "以此景點為中心的一日行程，帶您探索城市角落故事";

    const resFormDate = this.createElWithClasses("div", ["form"]);
    const formDateLabel = this.createElWithClasses("label", ["form__label"]);
    formDateLabel.innerText = "選擇日期：";
    const formDateInput = this.createElWithClasses("input", ["form__input"]);
    this.setAttributes(formDateInput, {
      type: "date",
      name: "date",
      id: "date",
      required: "",
    });
    resFormDate.append(formDateLabel, formDateInput);

    const resFormTime = this.createElWithClasses("div", ["form"]);
    const formTimeLabel = this.createElWithClasses("label", ["form__label"]);
    formTimeLabel.innerText = "選擇時間：";
    const formTimeInput = this.createElWithClasses("div", ["form__input"]);
    const timeRadio1 = this.createElWithClasses("div", [
      "form__radio-container",
      "session-choose",
    ]);
    const timeRadio1Input = document.createElement("input");
    this.setAttributes(timeRadio1Input, {
      type: "radio",
      name: "session",
      id: "session-morning",
      checked: "",
    });
    const timeRadio1Label = document.createElement("label");
    timeRadio1Label.innerText = "上半天";
    timeRadio1.append(timeRadio1Input, timeRadio1Label);
    const timeRadio2 = this.createElWithClasses("div", [
      "form__radio-container",
      "session-choose",
    ]);
    const timeRadio2Input = document.createElement("input");
    this.setAttributes(timeRadio2Input, {
      type: "radio",
      name: "session",
      id: "session-afternoon",
    });
    const timeRadio2Label = document.createElement("label");
    timeRadio2Label.innerText = "下半天";
    timeRadio2.append(timeRadio2Input, timeRadio2Label);
    formTimeInput.append(timeRadio1, timeRadio2);
    resFormTime.append(formTimeLabel, formTimeInput);

    const resFormPrice = this.createElWithClasses("div", ["form"]);
    const formPriceLabel = this.createElWithClasses("label", ["form__label"]);
    formPriceLabel.innerText = "導覽費用：";
    const formPriceInput = this.createElWithClasses("div", ["form__input"]);
    const priceSpan = document.createElement("span");
    priceSpan.id = "session-cost";
    priceSpan.innerText = "2000";
    formPriceInput.append("新台幣\xa0", priceSpan, "\xa0元");
    resFormPrice.append(formPriceLabel, formPriceInput);
    const resFormBtn = document.createElement("button");
    resFormBtn.setAttribute("type", "submit");
    resFormBtn.innerText = "開始預約行程";

    resFormEl.append(
      resFormTitle,
      resFormSubTitle,
      resFormDate,
      resFormTime,
      resFormPrice,
      resFormBtn
    );
    attractionResEl.appendChild(resFormEl);

    return [attractionTitleEl, attractionSubTitleEl, attractionResEl];
  }
}

export default new AttractionReservationInfoView();
