import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlRenderBooking,
  controlContactInput,
  controlBtnConfirm,
} from "../controller.js";

import navView from "../views/navView.js";
import bookingContactView from "../views/bookingContactView.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  await controlRenderBooking();
  bookingContactView.addHandlerInputChange(controlContactInput);
  tappaySetting();
  bookingContactView.addHandlerInputChange(controlBtnConfirm);
  TPDirect.card.onUpdate(function (update) {
    tappayShowInputResult(update);
    controlBtnConfirm();
  });
};

await init();

// DEV
import * as model from "../model.js";
import { tappaySetting, tappayShowInputResult } from "../service/tappay.js";
window.model = model;
