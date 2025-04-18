"use strict";

const userNameEl = document.getElementById("user");
const inputContactNameEl = document.getElementById("contact-name");
const inputContactEmailEl = document.getElementById("contact-email");
const attractionImgEl = document.querySelector(".booking__attraction-image");
const attractionTitleEl = document.querySelector(
  ".booking__attraction-title>span"
);
const bookingDateEl = document.querySelector(
  ".booking__attraction-detail--date"
);
const bookingTimeEl = document.querySelector(
  ".booking__attraction-detail--time"
);
const bookingPriceEl = document.querySelector(
  ".booking__attraction-detail--price"
);
const bookingAddressEl = document.querySelector(
  ".booking__attraction-detail--address"
);
const bookingTotalPriceEl = document.querySelector(
  ".booking__confirm>.caution>span"
);
const btnDeleteBooking = document.getElementById("btn-delete");

let bookingDataForOrder;

const getBookingAndRender = async function () {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  const bookingResponse = await fetch("/api/booking", {
    headers,
  });
  const userReponse = await fetch("/api/user/auth", { headers });
  const { data: bookingData } = await bookingResponse.json();
  const { data: userData } = await userReponse.json();
  userNameEl.innerText = userData.name;
  if (bookingData === null) {
    const containerEl = document.querySelector(".container");
    while (containerEl.childNodes.length > 2) {
      containerEl.removeChild(containerEl.lastChild);
    }
    const sectionEl = containerEl.querySelector("section");
    while (sectionEl.childNodes.length > 2) {
      sectionEl.removeChild(sectionEl.lastChild);
    }
    const noBookingEl = document.createElement("div");
    noBookingEl.innerText = "目前沒有任何待預定的行程";
    noBookingEl.style.color = "#666666";
    sectionEl.appendChild(noBookingEl);
    return;
  }
  bookingDataForOrder = bookingData;
  attractionImgEl.src = bookingData.attraction.image;
  attractionTitleEl.innerText = bookingData.attraction.name;
  bookingDateEl.innerText = bookingData.date;
  bookingTimeEl.innerText =
    bookingData.time === "morning" ? "上午9點到下午4點" : "下午2點到晚上9點";
  bookingPriceEl.innerText = `新台幣${bookingData.price}元`;
  bookingAddressEl.innerText = bookingData.attraction.address;
  inputContactNameEl.value = userData.name;
  inputContactEmailEl.value = userData.email;
  bookingTotalPriceEl.innerText = bookingData.price;
};

const deleteBooking = async function () {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  const response = await fetch("/api/booking", {
    method: "DELETE",
    headers,
  });
  const data = await response.json();
  if (data.ok) {
    window.location.href = "/booking";
  }
};

getBookingAndRender();

btnDeleteBooking.addEventListener("click", deleteBooking);

// TapPay Setting

TPDirect.setupSDK(
  159786,
  "app_0MVUSxxzks2dT9POjaxbqhJQy6gSExAnrDZGFEWnZ1dQPVF1zJllje4MOuIn",
  "sandbox"
);
var fields = {
  number: {
    // css selector
    element: "#card-number",
    placeholder: "**** **** **** ****",
  },
  expirationDate: {
    // DOM object
    element: document.getElementById("card-expiration-date"),
    placeholder: "MM / YY",
  },
  ccv: {
    element: "#card-ccv",
    placeholder: "後三碼",
  },
};
TPDirect.card.setup({
  fields: fields,
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
});
TPDirect.card.onUpdate(function (update) {
  const submitButton = document.getElementById("btn-confirm");
  update.canGetPrime === true;
  // --> you can call TPDirect.card.getPrime()
  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    submitButton.removeAttribute("disabled");
  } else {
    // Disable submit Button to get prime.
    submitButton.setAttribute("disabled", true);
  }

  // // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  // if (update.cardType === "visa") {
  //   // Handle card type visa.
  // }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError(".card-number-group");
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess(".card-number-group");
  } else {
    setNumberFormGroupToNormal(".card-number-group");
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError(".expiration-date-group");
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess(".expiration-date-group");
  } else {
    setNumberFormGroupToNormal(".expiration-date-group");
  }

  if (update.status.ccv === 2) {
    setNumberFormGroupToError(".ccv-group");
  } else if (update.status.ccv === 0) {
    setNumberFormGroupToSuccess(".ccv-group");
  } else {
    setNumberFormGroupToNormal(".ccv-group");
  }
});
function setNumberFormGroupToError(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.add("has-error");
  element.classList.remove("has-success");
}
function setNumberFormGroupToSuccess(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.remove("has-error");
  element.classList.add("has-success");
}
function setNumberFormGroupToNormal(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.remove("has-error");
  element.classList.remove("has-success");
}
function isContactInfoValid() {
  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const phone = document.getElementById("phone-number").value;
  return name !== "" && email !== "" && phone !== "";
}
function onSubmit(event) {
  event.preventDefault();
  if (!isContactInfoValid()) {
    return alert("請輸入完整聯絡資訊！");
  }
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    // alert("can not get prime");
    alert("無法付款，請稍後再試。");
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("錯誤：" + result.msg + "請聯繫客服人員。");
      // alert("get prime error " + result.msg);
      return;
    }
    // alert("get prime 成功，prime: " + result.card.prime);
    // console.log(result);
    const token = localStorage.getItem("token");
    const { price: orderPrice, ...orderTrip } = bookingDataForOrder;
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        prime: result.card.prime,
        order: {
          price: orderPrice,
          trip: orderTrip,
          contact: {
            name: document.getElementById("contact-name").value,
            email: document.getElementById("contact-email").value,
            phone: document.getElementById("phone-number").value,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          window.location.href = `/thankyou?number=${data.data.number}`;
        } else {
          alert(`無法完成訂單。${data.message}，請稍後再試`);
        }
      });
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
  });
}
document.getElementById("tappay").addEventListener("submit", onSubmit);
