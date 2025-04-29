import View from "./view.js";

class BookingConfirmView extends View {
  parentElement = document.querySelector(".container");

  enableBtnConfirm() {
    this.parentElement
      .querySelector("#btn-confirm")
      .removeAttribute("disabled");
  }

  disableBtnConfirm() {
    this.parentElement
      .querySelector("#btn-confirm")
      .setAttribute("disabled", "");
  }

  generateHtmlStructureList() {
    const confirmSectionEl = this.createElWithClasses("section", ["booking"]);
    const confirmEl = this.createElWithClasses("div", ["booking__confirm"]);
    const priceCautionEl = this.createElWithClasses("div", ["caution"]);
    priceCautionEl.innerText = `總價：新台幣 ${this.data.bookingData.price} 元`;
    const btnConfirmEl = document.createElement("button");
    this.setAttributes(btnConfirmEl, {
      id: "btn-confirm",
      type: "submit",
      form: "tappay",
      disabled: "",
    });
    btnConfirmEl.innerText = "確認訂購並付款";
    confirmEl.append(priceCautionEl, btnConfirmEl);
    confirmSectionEl.appendChild(confirmEl);
    return [confirmSectionEl];
  }
}

export default new BookingConfirmView();

{
  /* 
<section class="booking">
    <div class="booking__confirm">
        <div class="caution">總價：新台幣<span>2000</span>元</div>
        <button id="btn-confirm" type="submit" form="tappay" disabled>
            確認訂購並付款
        </button>
    </div>
</section> */
}
