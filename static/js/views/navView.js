import View from "./view.js";

class NavView extends View {
  parentElement = document.querySelector(".nav__list");

  renderNavForGuest() {
    const btnBookingEl = document.createElement("li");
    btnBookingEl.id = "btn-booking";
    btnBookingEl.innerText = "預定行程";
    const btnSignUpInEl = document.createElement("li");
    btnSignUpInEl.id = "btn-signup-in";
    btnSignUpInEl.innerText = "登入/註冊";
    this.parentElement.append(btnBookingEl, btnSignUpInEl);
  }

  renderNavForMember() {
    const btnBookingEl = document.createElement("li");
    btnBookingEl.id = "btn-booking";
    btnBookingEl.innerText = "預定行程";
    const btnSignOutInEl = document.createElement("li");
    btnSignOutInEl.id = "btn-signout";
    btnSignOutInEl.innerText = "登出系統";
    this.parentElement.append(btnBookingEl, btnSignOutInEl);
  }

  addHandlerClickNavLiEl(handler) {
    this.parentElement.addEventListener("click", (e) => {
      const clickedNavLiEl = e.target.closest("li");
      if (!clickedNavLiEl) return;
      handler(clickedNavLiEl.id);
    });
  }
}

export default new NavView();
