import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlRenderBooking,
} from "../controller.js";

import navView from "../views/navView.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  bookingView.addHandlerRender(controlRenderBooking);
};

await init();

// DEV
import * as model from "../model.js";
import bookingView from "../views/bookingView.js";
window.model = model;
