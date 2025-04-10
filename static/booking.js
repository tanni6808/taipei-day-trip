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
const btnDeleteBooking = document.getElementById("btn-delete");

const getBookingAndRender = async function () {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  const bookingResponse = await fetch("/api/booking", {
    headers,
  });
  const userReponse = await fetch("/api/user/auth", { headers });
  const { data: bookingData } = await bookingResponse.json();
  const { data: userData } = await userReponse.json();
  if (bookingData === null) {
    const containerEl = document.querySelector(".container");
    while (containerEl.childNodes.length > 2) {
      containerEl.removeChild(containerEl.lastChild);
    }
    const sectionEl = containerEl.querySelector("section");
    console.log(sectionEl);
    while (sectionEl.childNodes.length > 2) {
      sectionEl.removeChild(sectionEl.lastChild);
    }
    const noBookingEl = document.createElement("div");
    noBookingEl.innerText = "目前沒有任何待預定的行程";
    noBookingEl.style.color = "#666666";
    sectionEl.appendChild(noBookingEl);
    return;
  }
  userNameEl.innerText = userData.name;
  attractionImgEl.src = bookingData.attraction.image;
  attractionTitleEl.innerText = bookingData.attraction.name;
  bookingDateEl.innerText = bookingData.date;
  bookingTimeEl.innerText =
    bookingData.time === "morning" ? "上午9點到下午4點" : "下午2點到晚上9點";
  bookingPriceEl.innerText = `新台幣${bookingData.price}元`;
  bookingAddressEl.innerText = bookingData.attraction.address;
  inputContactNameEl.value = userData.name;
  inputContactEmailEl.value = userData.email;
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
