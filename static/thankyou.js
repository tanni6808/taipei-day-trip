"use strict";

const paymentResultEl = document.querySelector("section.thankyou>h3>span");
const orderNumberEl = document.querySelector("section.thankyou>p>span");
const cautionEl = document.querySelector("section.thankyou>.caution");

const searchPartsThankyou = window.location.search.split("=");
const orderNumber = searchPartsThankyou[searchPartsThankyou.length - 1];

const getOrderStatus = async function (orderNumber) {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/order/${orderNumber}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const { data } = await response.json();
  orderNumberEl.innerText = data.number;
  if (data.status === 0) {
    paymentResultEl.innerText = "失敗";
    cautionEl.innerText = "請聯繫客服人員並提供此訂單編號繼續付款手續。";
  } else {
    paymentResultEl.innerText = "成功";
    cautionEl.innerText =
      "請妥善保存此訂單編號，如有任何問題，請聯繫客服人員並提供此訂單編號進行查詢。";
  }
};

getOrderStatus(orderNumber);
