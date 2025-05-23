import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlClosePopup,
  controlRenderForm,
  controlSwitchPopupForm,
  controlSubmitPopupForm,
  loadAttractionPageDetail,
  controlSliderChangeTo,
  controlSliderPrevNext,
  controlSliderResize,
  controlRenderAttractionPageGallery,
  controlRenderAttractionPageResInfo,
  controlTimeRadioCheck,
  controlRenderAttractionBody,
  controlSubmitReservationForm,
} from "../controller.js";
import navView from "../views/navView.js";
import popupView from "../views/popupView.js";
import attractionGalleryView from "../views/attractionGalleryView.js";
import attractionReservationInfoView from "../views/attractionReservationInfoView.js";
import attractionBodyView from "../views/attractionBodyView.js";

const init = async function () {
  await loadUserState();
  await loadAttractionPageDetail();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  popupView.addHandlerClickClose(controlClosePopup);
  attractionGalleryView.addHandlerRender(controlRenderAttractionPageGallery);
  attractionReservationInfoView.addHandlerRender(
    controlRenderAttractionPageResInfo
  );
  attractionReservationInfoView.addHandlerSubmitForm(
    controlSubmitReservationForm
  );
  attractionBodyView.addHandlerRender(controlRenderAttractionBody);
  attractionReservationInfoView.addHandlerClickTime(controlTimeRadioCheck);
  attractionGalleryView.addHandlerClickBtnArrow(controlSliderPrevNext);
  attractionGalleryView.addHandlerClickNavDot(controlSliderChangeTo);
  window.addEventListener("resize", controlSliderResize);
  popupView.addHandlerRenderForm(controlRenderForm);
  popupView.addHandlerClickBtnSwitch(controlSwitchPopupForm);
  popupView.addHandlerSubmitForm(controlSubmitPopupForm);
};

await init();

// // DEV
// import * as model from "../model.js";
// window.model = model;
