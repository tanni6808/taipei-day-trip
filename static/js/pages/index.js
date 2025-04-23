import {
  controlMrtBar,
  controlMrtBarScrollToLeft,
  controlMrtBarScrollToRight,
  controlSearchForm,
  controlIndexAttraction,
} from "../controller.js";
import mrtBarView from "../views/mrtBarView.js";
import indexAttractionView from "../views/indexAttractionView.js";

const init = function () {
  mrtBarView.addHandlerRender(controlMrtBar);
  mrtBarView.addHandlerClickMrtLiEl(controlSearchForm);
  mrtBarView.addHandlerClickBtnScrollToLeft(controlMrtBarScrollToLeft);
  mrtBarView.addHandlerClickBtnScrollToRight(controlMrtBarScrollToRight);
  indexAttractionView.addHandlerRender(controlIndexAttraction);
  indexAttractionView.addHandlerTouchFooter(controlIndexAttraction);
};

init();

// DEV
import * as model from "../model.js";
window.model = model;
