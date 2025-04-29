import View from "./view.js";

class ThankyouView extends View {
  parentElement = document.querySelector("section.thankyou");

  generateHtmlStructureList() {
    const titleEl = document.createElement("h3");
    titleEl.innerText = this.data.status === 1 ? "付款成功" : "付款失敗";
    const orderNumberEl = document.createElement("p");
    orderNumberEl.innerText = `訂單編號：${this.data.number}`;
    const cautionEl = this.createElWithClasses("p", ["caution"]);
    cautionEl.innerText =
      this.data.status === 1
        ? "請妥善保存此訂單編號，如有任何問題，請聯繫客服人員並提供此訂單編號進行查詢。"
        : "請聯繫客服人員並提供此訂單編號繼續付款手續。";

    return [titleEl, orderNumberEl, cautionEl];
  }
}

export default new ThankyouView();
