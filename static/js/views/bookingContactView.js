import View from "./view.js";

class BookingContactView extends View {
  parentElement = document.querySelector(".container");

  generateHtmlStructureList() {
    const contactFormSectionEl = this.createElWithClasses("section", [
      "booking",
    ]);
    const contactFormDivEl = this.createElWithClasses("div", [
      "booking__user-contact-info",
    ]);
    const contactFormTitleEl = document.createElement("h4");
    contactFormTitleEl.innerText = "您的聯絡資訊";

    const contactFormEl = document.createElement("form");

    const fContactName = this.generateFormDivEl(
      "聯絡姓名：",
      "text",
      "contact-name"
    );
    fContactName.lastChild.value = this.data.userData.name;
    const fContactEmail = this.generateFormDivEl(
      "聯絡信箱：",
      "email",
      "contact-email"
    );
    fContactEmail.lastChild.value = this.data.userData.email;
    const fContactPhone = this.generateFormDivEl(
      "手機號碼：",
      "text",
      "phone-number"
    );
    fContactPhone.lastChild.setAttribute("pattern", `^09\\d{8}$`);
    contactFormEl.append(fContactName, fContactEmail, fContactPhone);
    const cautionEl = this.createElWithClasses("div", ["caution"]);
    cautionEl.innerText =
      "請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的連絡方式。";
    contactFormDivEl.append(contactFormTitleEl, contactFormEl, cautionEl);
    contactFormSectionEl.appendChild(contactFormDivEl);

    return [contactFormSectionEl, document.createElement("hr")];
  }

  showInputCheckResult(inputField) {
    this.clearInputCheckResult(inputField);
    const checkResultEl = this.createElWithClasses("span", ["input-check"]);
    inputField.previousElementSibling.style.color = "#D15858";
    inputField.style.border = "1px solid #D15858";
    if (inputField.value === "") {
      checkResultEl.innerText = "請輸入內容";
      inputField.after(checkResultEl);
      return false;
    }
    if (inputField.id === "phone-number" && !inputField.validity.valid) {
      checkResultEl.innerText = "請輸入正確的手機號碼";
      inputField.after(checkResultEl);
      return false;
    }
    if (inputField.id === "contact-email" && !inputField.validity.valid) {
      checkResultEl.innerText = "請輸入正確的信箱地址";
      inputField.after(checkResultEl);
      return false;
    }

    inputField.previousElementSibling.style.color = "#666666";
    inputField.style.border = "1px solid #e8e8e8";
    return true;
  }
  clearInputCheckResult(inputField) {
    if (inputField.nextElementSibling === null) return;
    inputField.closest("div").removeChild(inputField.nextElementSibling);
  }

  addHandlerInputChange(handler) {
    const events = ["input", "focusout"];
    events.forEach((event) => {
      this.parentElement.addEventListener(event, (e) => {
        if (!e.target.closest("div").classList.contains("form")) return;
        handler(e.target);
      });
    });
  }

  generateFormDivEl(labelText, inputType, attribute) {
    const formDivEl = this.createElWithClasses("div", ["form"]);

    const cFLabel = document.createElement("label");
    this.setAttributes(cFLabel, { for: attribute });
    cFLabel.innerText = labelText;
    const cFInput = document.createElement("input");
    this.setAttributes(cFInput, {
      type: inputType,
      name: attribute,
      id: attribute,
    });
    formDivEl.append(cFLabel, cFInput);
    return formDivEl;
  }
}

export default new BookingContactView();
