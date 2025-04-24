// STATUS
export const state = {
  signIn: false,
  account: {},
  attractionSearch: {
    nextPage: 0,
    keyword: "",
  },
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
