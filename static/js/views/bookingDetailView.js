import View from "./view.js";

class BookingDetailView extends View {
  parentElement = document.querySelector(".container");

  addHnadlerClickBtnDelete(handler) {
    this.parentElement.addEventListener("click", (e) => {
      if (e.target.id === "btn-delete") handler();
    });
  }

  generateHtmlStructureList() {
    const bookingAttractionSectionEl = this.createElWithClasses("section", [
      "booking",
    ]);
    const bookingAttractionSectionTitle = document.createElement("h4");
    bookingAttractionSectionTitle.innerText = `您好，${this.data.userData.name}，待預定的行程如下：`;
    if (this.data.bookingData === null) {
      const noBookingEl = document.createElement("div");
      noBookingEl.innerText = "目前沒有任何待預定的行程";
      noBookingEl.style.color = "#666666";
      bookingAttractionSectionEl.append(
        bookingAttractionSectionTitle,
        noBookingEl
      );
      return [bookingAttractionSectionEl];
    }
    const bookingAttractionEl = document.createElement("div");
    bookingAttractionEl.classList.add("booking__attraction");

    const bAImageEl = document.createElement("img");
    bAImageEl.classList.add("booking__attraction-image");
    bAImageEl.src = this.data.bookingData.attraction.image;

    const bAInfoEl = document.createElement("div");
    bAInfoEl.classList.add("booking__attraction-info");

    const bAInfoTitleEl = document.createElement("div");
    bAInfoTitleEl.classList.add("booking__attraction-title", "bold");
    bAInfoTitleEl.innerText = `台北一日遊：${this.data.bookingData.attraction.name}`;
    const bAInfoDateEl = this.generateBookingAttractionDetail("日期：", "date");
    bAInfoDateEl.lastChild.innerText = this.data.bookingData.date;
    const bAInfoTimeEl = this.generateBookingAttractionDetail("時間：", "time");
    bAInfoTimeEl.lastChild.innerText =
      this.data.bookingData.time === "morning" ? "上半天" : "下半天";
    const bAInfoPriceEl = this.generateBookingAttractionDetail(
      "費用：",
      "price"
    );
    bAInfoPriceEl.lastChild.innerText = this.data.bookingData.price + "元";
    const bAInfoAddressEl = this.generateBookingAttractionDetail(
      "地點：",
      "address"
    );
    bAInfoAddressEl.lastChild.innerText =
      this.data.bookingData.attraction.address;

    bAInfoEl.append(
      bAInfoTitleEl,
      bAInfoDateEl,
      bAInfoTimeEl,
      bAInfoPriceEl,
      bAInfoAddressEl
    );
    const btnDeleteEl = document.createElement("img");
    btnDeleteEl.id = "btn-delete";
    btnDeleteEl.src = "/src/img/icon/delete.png";

    bookingAttractionEl.append(bAImageEl, bAInfoEl, btnDeleteEl);

    bookingAttractionSectionEl.append(
      bookingAttractionSectionTitle,
      bookingAttractionEl
    );

    return [bookingAttractionSectionEl, document.createElement("hr")];
  }

  generateBookingAttractionDetail(labelText, className) {
    const bookingAttractionDetailEl = document.createElement("div");
    bookingAttractionDetailEl.classList.add("booking__attraction-detail");

    const bADLabel = document.createElement("div");
    bADLabel.classList.add("booking__attraction-detail--label");
    bADLabel.innerText = labelText;
    const bADContent = document.createElement("div");
    bADContent.classList.add(`booking__attraction-detail--${className}`);
    bookingAttractionDetailEl.append(bADLabel, bADContent);
    return bookingAttractionDetailEl;
  }
}

export default new BookingDetailView();
