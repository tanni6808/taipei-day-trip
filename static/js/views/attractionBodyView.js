import View from "./view.js";

class AttractionBodyView extends View {
  parentElement = document.querySelector(".attraction__body");

  generateHtmlStructureList() {
    const attractionDetail = document.createElement("p");
    attractionDetail.innerText = this.data.description;

    const attractionAddressTitle = document.createElement("div");
    attractionAddressTitle.classList.add("bold");
    attractionAddressTitle.innerText = "景點地址：";

    const attractionAddress = document.createElement("p");
    attractionAddress.innerText = this.data.address;

    const attractionTransportTitle = document.createElement("div");
    attractionTransportTitle.classList.add("bold");
    attractionTransportTitle.innerText = "交通方式：";

    const attractionTransport = document.createElement("p");
    attractionTransport.innerText = this.data.transport;

    return [
      attractionDetail,
      attractionAddressTitle,
      attractionAddress,
      attractionTransportTitle,
      attractionTransport,
    ];
  }
}

export default new AttractionBodyView();

// <!-- <p>景點詳細內容描述</p>
// <div class="bold">景點地址：</div>
// <p>地址</p>
// <div class="bold">交通方式：</div>
// <p>交通</p> -->
