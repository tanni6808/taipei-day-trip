// STATUS
export const state = {
  signIn: false,
  account: null,
  attractionSearch: {
    nextPage: 0,
    keyword: "",
  },
  attractionPageDetail: null,
  attractionPageSliderIndex: 0,
  bookingData: null,
  contactNameValid: true,
  contactEmailValid: true,
  contactPhoneValid: false,
};

// GET
// User Status
export const getUserStatus = async function () {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  try {
    const response = await fetch("/api/user/auth", { headers });
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error(`Model error: ${err}`);
    throw err;
  }
};

// MRT List
export const getMrtList = async function () {
  try {
    const response = await fetch("/api/mrts");
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data.data;
  } catch (err) {
    console.error(`Model error: ${err}`);
    throw err;
  }
};

// Attraction List
export const getAttractionList = async function (page, keyword = "") {
  const url =
    keyword === ""
      ? `/api/attractions?page=${page}`
      : `/api/attractions?page=${page}&keyword=${keyword}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data;
  } catch (err) {
    console.error(`Model error: ${err}`);
    throw err;
  }
};

// Attraction Page Info
export const getAttrationDetail = async function (attractionId) {
  const response = await fetch(`/api/attraction/${attractionId}`);
  const data = await response.json();
  return data;
};

// BOOKING
export const getBooking = async function () {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: "Bearer " + token } : {};
  const response = await fetch("/api/booking", {
    headers,
  });
  const data = await response.json();
  return data.data;
};

// SEND
// Account
export const sendAccountSignUp = async function (formEl) {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formEl.querySelector("#name").value,
        email: formEl.querySelector("#email").value,
        password: formEl.querySelector("#password").value,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data;
  } catch (err) {
    // console.error(err);
    throw err;
  }
};

export const sendAccountSignIn = async function (formEl) {
  try {
    const response = await fetch("/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formEl.querySelector("#email").value,
        password: formEl.querySelector("#password").value,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    // console.error(err);
    throw err;
  }
};

// Booking
export const sendAddBooking = async function (formEl) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        attractionId: state.attractionPageDetail.id,
        date: formEl.querySelector("#date").value,
        time:
          formEl.querySelector("#session-morning").checked === true
            ? "morning"
            : "afternoon",
        price: formEl.querySelector("#session-cost").innerText,
      }),
    });
    const result = response.json();
    if (result.error) throw new Error(result.message);
    return result;
  } catch (err) {
    throw err;
  }
};

export const sendDeleteBooking = async function () {
  try {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: "Bearer " + token } : {};
    const response = await fetch("/api/booking", {
      method: "DELETE",
      headers,
    });
    const result = await response.json();
    if (result.error) throw new Error(result.message);
    return result;
  } catch (err) {
    throw err;
  }
};

// Order
export const sendOrder = async function (prime) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        prime: prime,
        order: {
          price: state.bookingData.price,
          trip: {
            attraction: state.bookingData.attraction,
            date: state.bookingData.date,
            time: state.bookingData.time,
          },
          contact: {
            name: document.getElementById("contact-name").value,
            email: document.getElementById("contact-email").value,
            phone: document.getElementById("phone-number").value,
          },
        },
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.message);
    return data.data;
  } catch (err) {
    throw err;
  }
};
