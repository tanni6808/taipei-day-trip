import View from "./view.js";

class BookingPaymentView extends View {
  parentElement = document.querySelector(".container");

  addHandlerSubmitPayment(handler) {
    this.parentElement.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.id === "tappay") {
        handler();
      }
    });
  }

  generateHtmlStructureList() {
    const tappayFormSectionEl = this.createElWithClasses("section", [
      "booking",
    ]);
    const tappayFormDivEl = this.createElWithClasses("div", [
      "booking__payment",
    ]);
    const tappayFormTitleEl = document.createElement("h4");
    tappayFormTitleEl.innerText = "信用卡付款資訊";

    const tappayFormEl = document.createElement("form");
    tappayFormEl.id = "tappay";

    const tFGCardNumber = this.generateTappayFormGroupEl(
      "卡片號碼：",
      "card-number"
    );
    const tFGExDate = this.generateTappayFormGroupEl(
      "過期時間：",
      "expiration-date"
    );
    const tFGCcv = this.generateTappayFormGroupEl("驗證密碼：", "ccv");

    tappayFormEl.append(tFGCardNumber, tFGExDate, tFGCcv);
    tappayFormDivEl.append(tappayFormTitleEl, tappayFormEl);
    tappayFormSectionEl.appendChild(tappayFormDivEl);

    return [tappayFormSectionEl, document.createElement("hr")];
  }
  generateTappayFormGroupEl(labelText, attribute) {
    const formGroupEl = this.createElWithClasses("div", [
      "form-group",
      `${attribute}-group`,
    ]);

    const tFGLabel = this.createElWithClasses("label", ["control-label"]);
    this.setAttributes(tFGLabel, { for: attribute });
    tFGLabel.innerText = labelText;
    const tFGInputDiv = this.createElWithClasses("div", [
      "tpfield",
      "form-control",
      attribute,
    ]);
    tFGInputDiv.id = attribute;
    formGroupEl.append(tFGLabel, tFGInputDiv);
    return formGroupEl;
  }
}

export default new BookingPaymentView();
