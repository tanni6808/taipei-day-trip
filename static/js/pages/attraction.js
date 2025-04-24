import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlClosePopup,
  controlRenderForm,
  controlSwitchPopupForm,
  controlSubmitPopupForm,
  controlRenderAttractionPageDetail,
  loadAttractionPageDetail,
} from "../controller.js";
import navView from "../views/navView.js";
import popupView from "../views/popupView.js";
import attractionGalleryView from "../views/attractionGalleryView.js";

const init = async function () {
  await loadUserState();
  await loadAttractionPageDetail();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  popupView.addHandlerClickClose(controlClosePopup);
  attractionGalleryView.addHandlerRender(controlRenderAttractionPageDetail);
  if (!model.state.signIn) {
    popupView.addHandlerRenderForm(controlRenderForm);
    popupView.addHandlerClickBtnSwitch(controlSwitchPopupForm);
    popupView.addHandlerSubmitForm(controlSubmitPopupForm);
  }
};

await init();

// DEV
import * as model from "../model.js";
window.model = model;
