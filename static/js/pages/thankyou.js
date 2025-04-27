import {
  loadUserState,
  controlRenderNav,
  controlNavAction,
  controlRenderThankyouPage,
} from "../controller.js";
import navView from "../views/navView.js";
import thankyouView from "../views/thankyouView.js";

const init = async function () {
  await loadUserState();
  navView.addHandlerRender(controlRenderNav);
  navView.addHandlerClickNavLiEl(controlNavAction);
  thankyouView.addHandlerRender(controlRenderThankyouPage);
};

await init();

// // DEV
// import * as model from "../model.js";
// window.model = model;
