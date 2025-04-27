import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlRenderBooking,
  controlContactInput,
  controlBtnConfirm,
  controlDeleteBooking,
  controlSubmitPayment,
} from "../controller.js";

import navView from "../views/navView.js";
import bookingDetailView from "../views/bookingDetailView.js";
import bookingContactView from "../views/bookingContactView.js";
import bookingPaymentView from "../views/bookingPaymentView.js";
import { tappayShowInputResult } from "../service/tappay.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  await controlRenderBooking();
  bookingDetailView.addHnadlerClickBtnDelete(controlDeleteBooking);
  bookingContactView.addHandlerInputChange(controlContactInput);
  bookingContactView.addHandlerInputChange(controlBtnConfirm);
  TPDirect.card.onUpdate(function (update) {
    tappayShowInputResult(update);
    controlBtnConfirm();
  });
  bookingPaymentView.addHandlerSubmitPayment(controlSubmitPayment);
};

await init();

// DEV
import * as model from "../model.js";
window.model = model;
