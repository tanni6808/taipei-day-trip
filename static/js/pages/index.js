import {
  loadUserState,
  controlRenderMrtBar,
  controlMrtBarScrollToLeft,
  controlMrtBarScrollToRight,
  controlFillSearchForm,
  controlRenderIndexAttraction,
  controlRenderSearchResult,
  controlRenderNav,
  controlNavAction,
  controlClosePopup,
  controlRenderForm,
  controlSwitchPopupForm,
  controlSubmitPopupForm,
} from "../controller.js";
import navView from "../views/navView.js";
import mrtBarView from "../views/mrtBarView.js";
import indexAttractionView from "../views/indexAttractionView.js";
import searchFormView from "../views/searchFormView.js";
import popupView from "../views/popupView.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  mrtBarView.addHandlerRender(controlRenderMrtBar);
  mrtBarView.addHandlerClickMrtLiEl(controlFillSearchForm);
  mrtBarView.addHandlerClickMrtLiEl(controlRenderSearchResult);
  mrtBarView.addHandlerClickBtnScrollToLeft(controlMrtBarScrollToLeft);
  mrtBarView.addHandlerClickBtnScrollToRight(controlMrtBarScrollToRight);
  indexAttractionView.addHandlerRender(controlRenderIndexAttraction);
  indexAttractionView.addHandlerTouchFooter(controlRenderIndexAttraction);
  searchFormView.addHandlerSearch(controlRenderSearchResult);
  popupView.addHandlerClickClose(controlClosePopup);
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
