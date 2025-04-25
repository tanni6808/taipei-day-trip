import * as model from "./model.js";
import navView from "./views/navView.js";
import searchFormView from "./views/searchFormView.js";
import mrtBarView from "./views/mrtBarView.js";
import indexAttractionView from "./views/indexAttractionView.js";
import popupView from "./views/popupView.js";
import attractionGalleryView from "./views/attractionGalleryView.js";
import attractionReservationInfoView from "./views/attractionReservationInfoView.js";

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

export const controlRenderNav = function () {
  if (!model.state.signIn) navView.renderNavForGuest();
  else {
    navView.renderNavForMember();
  }
};

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
