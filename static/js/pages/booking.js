import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlRenderBooking,
  controlContactInput,
} from "../controller.js";

import navView from "../views/navView.js";
import bookingDetailView from "../views/bookingDetailView.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  controlRenderBooking();
  bookingContactView.addHandlerInputChange(controlContactInput);
};

await init();

// DEV
import * as model from "../model.js";
import bookingContactView from "../views/bookingContactView.js";
window.model = model;
