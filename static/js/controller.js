import * as model from "./model.js";
import navView from "./views/navView.js";
import searchFormView from "./views/searchFormView.js";
import mrtBarView from "./views/mrtBarView.js";
import indexAttractionView from "./views/indexAttractionView.js";
import popupView from "./views/popupView.js";
import attractionGalleryView from "./views/attractionGalleryView.js";
import attractionReservationInfoView from "./views/attractionReservationInfoView.js";
import attractionBodyView from "./views/attractionBodyView.js";
import bookingDetailView from "./views/bookingDetailView.js";
import bookingContactView from "./views/bookingContactView.js";
import bookingPaymentView from "./views/bookingPaymentView.js";
import bookingConfirmView from "./views/bookingConfirmView.js";
import { tappaySetting } from "./service/tappay.js";

export const loadUserState = async function () {
  try {
    const member = await model.getUserStatus();
    if (member === null) return;
    model.state.signIn = true;
    model.state.account = member;
  } catch (err) {
    console.log(err);
  }
};

// INDEX
export const controlRenderIndexAttraction = async function () {
  const attractionSearch = model.state.attractionSearch;
  if (attractionSearch.nextPage === null) return;
  const { nextPage, data: attractionList } = await model.getAttractionList(
    attractionSearch.nextPage,
    attractionSearch.keyword
  );
  const keepCurrentEl = attractionSearch.nextPage === 0 ? false : true;
  indexAttractionView.render(attractionList, keepCurrentEl);
  model.state.attractionSearch.nextPage = nextPage;
};

export const controlRenderMrtBar = async function () {
  const mrtList = await model.getMrtList();
  mrtBarView.render(mrtList);
};

export const controlMrtBarScrollToLeft = function () {
  mrtBarView.scrollTo("left");
};

export const controlMrtBarScrollToRight = function () {
  mrtBarView.scrollTo("right");
};

export const controlFillSearchForm = async function (input) {
  searchFormView.fillInput(input);
};

export const controlRenderSearchResult = async function (input) {
  model.state.attractionSearch.keyword = input;
  model.state.attractionSearch.nextPage = 0;
  controlRenderIndexAttraction();
};

// ATTRACTION
export const loadAttractionPageDetail = async function () {
  const pathParts = window.location.pathname.split("/");
  const attractionId = pathParts[pathParts.length - 1];
  const data = await model.getAttrationDetail(attractionId);
  model.state.attractionPageDetail = data.data;
};

export const controlRenderAttractionPageGallery = function () {
  attractionGalleryView.render(model.state.attractionPageDetail);
};

export const controlRenderAttractionPageResInfo = function () {
  attractionReservationInfoView.render(model.state.attractionPageDetail);
};

export const controlRenderAttractionBody = function () {
  attractionBodyView.render(model.state.attractionPageDetail);
};

export const controlSliderPrevNext = function (direction) {
  const totalSlideNum = document.querySelectorAll(
    ".attraction__slider>img"
  ).length;
  const delta = direction === "prev" ? -1 : 1;
  model.state.attractionPageSliderIndex =
    (model.state.attractionPageSliderIndex + delta + totalSlideNum) %
    totalSlideNum;
  attractionGalleryView.sliderScrollTo(model.state.attractionPageSliderIndex);
};

export const controlSliderChangeTo = function (index) {
  model.state.attractionPageSliderIndex = index;
  attractionGalleryView.sliderScrollTo(model.state.attractionPageSliderIndex);
};

export const controlSliderResize = function () {
  attractionGalleryView.sliderResizeWithWidth(
    model.state.attractionPageSliderIndex
  );
};

export const controlTimeRadioCheck = function (id) {
  attractionReservationInfoView.checkTime(id);
  attractionReservationInfoView.changePrice(id);
};

export const controlSubmitReservationForm = async function (formEl) {
  if (!model.state.signIn) {
    return popupView.showPopup();
  }
  try {
    const result = await model.sendAddBooking(formEl);
    if (result.ok) window.location.href = "/booking";
  } catch (err) {
    console.log(err);
  }
};

// BOOKING
export const controlRenderBooking = async function () {
  const bookingData = await model.getBooking();
  model.state.bookingData = bookingData;
  const data = {
    bookingData: model.state.bookingData,
    userData: model.state.account,
  };
  bookingDetailView.render(data);
  if (bookingData === null) return;
  bookingContactView.render(data, true);
  bookingPaymentView.render(data, true);
  bookingConfirmView.render(data, true);
  tappaySetting();
};

export const controlDeleteBooking = async function () {
  if (!confirm("確定刪除？")) return;
  try {
    const result = await model.sendDeleteBooking();
    if (result.ok) window.location.href = "/booking";
  } catch (err) {
    console.log(err);
  }
};

export const controlContactInput = function (inputField) {
  const contactFormValid = bookingContactView.showInputCheckResult(inputField);
  if (inputField.id === "contact-name") {
    model.state.contactNameValid = contactFormValid;
  } else if (inputField.id === "contact-email") {
    model.state.contactEmailValid = contactFormValid;
  } else {
    model.state.contactPhoneValid = contactFormValid;
  }
};

export const controlBtnConfirm = function () {
  const tappayValid = TPDirect.card.getTappayFieldsStatus().canGetPrime;
  if (
    model.state.contactNameValid &&
    model.state.contactEmailValid &&
    model.state.contactPhoneValid &&
    tappayValid
  ) {
    bookingConfirmView.enableBtnConfirm();
  } else {
    bookingConfirmView.disableBtnConfirm();
  }
};

export const controlSubmitPayment = async function () {
  TPDirect.card.getPrime((result) => {
    console.log(result);
    if (result.status !== 0) alert("錯誤：" + result.msg + "請聯繫客服人員。");
    model.sendOrder(result.card.prime).then((orderResult) => {
      if (orderResult.error)
        alert(`無法完成訂單。${orderResult.message}，請稍後再試`);
      else window.location.href = `/thankyou?number=${orderResult.number}`;
    });
  });
};

// COMMON
export const controlRenderNav = function () {
  if (!model.state.signIn) navView.renderNavForGuest();
  else {
    navView.renderNavForMember();
  }
};

export const controlNavAction = function (clickBtnId) {
  if (clickBtnId === "btn-booking") {
    if (!model.state.signIn) popupView.showPopup();
    else window.location.href = "/booking";
  } else if (clickBtnId === "btn-signup-in") {
    popupView.showPopup();
  } else {
    localStorage.removeItem("token");
    location.reload();
  }
};

export const controlRenderForm = function () {
  popupView.generateFormEl("signup");
  popupView.renderFormEl();
};

export const controlSwitchPopupForm = function () {
  popupView.removeFormEl();
  if (popupView.formEl.id === "signup") popupView.generateFormEl("signin");
  else popupView.generateFormEl("signup");
  popupView.renderFormEl();
};

export const controlSubmitPopupForm = async function (formId) {
  try {
    if (formId === "signup") {
      const response = await model.sendAccountSignUp(popupView.formEl);
      if (!response.error) popupView.renderNewHint("註冊成功！");
    } else {
      const response = await model.sendAccountSignIn(popupView.formEl);
      if (!response.error) location.reload();
    }
  } catch (err) {
    popupView.renderNewHint(err);
  }
};

export const controlClosePopup = function () {
  popupView.hidePopup();
};
