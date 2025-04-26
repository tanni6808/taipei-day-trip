export const tappaySetting = function () {
  // TapPay Setting
  TPDirect.setupSDK(
    159786,
    "app_0MVUSxxzks2dT9POjaxbqhJQy6gSExAnrDZGFEWnZ1dQPVF1zJllje4MOuIn",
    "sandbox"
  );
  var fields = {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#ccv",
      placeholder: "後三碼",
    },
  };
  TPDirect.card.setup({
    fields: fields,
    styles: {
      // Style all elements
      input: {
        color: "black",
        "font-weight": "bold",
        "font-size": "16px",
      },
      // Styling ccv field
      "input.ccv": {
        // 'font-size': '16px'
      },
      // Styling expiration-date field
      "input.expiration-date": {
        // 'font-size': '16px'
      },
      // Styling card-number field
      "input.card-number": {
        // 'font-size': '16px'
      },
      // style focus state
      ":focus": {
        // 'color': 'black'
      },
      // style valid state
      ".valid": {
        color: "black",
      },
      // style invalid state
      ".invalid": {
        color: "#d15858",
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      "@media screen and (max-width: 400px)": {
        input: {
          // color: "orange",
        },
      },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
      beginIndex: 6,
      endIndex: 11,
    },
  });
};

//   const tappayStatus = TPDirect.card.getTappayFieldsStatus();

export const tappayShowInputResult = function (update) {
  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError(".card-number-group");
    clearInputCheckResult(".card-number-group");
    showInputCheckError(".card-number-group", "卡號");
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess(".card-number-group");
    clearInputCheckResult(".card-number-group");
  } else {
    setNumberFormGroupToNormal(".card-number-group");
    clearInputCheckResult(".card-number-group");
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError(".expiration-date-group");
    clearInputCheckResult(".expiration-date-group");
    showInputCheckError(".expiration-date-group", "日期");
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess(".expiration-date-group");
    clearInputCheckResult(".expiration-date-group");
  } else {
    setNumberFormGroupToNormal(".expiration-date-group");
    clearInputCheckResult(".expiration-date-group");
  }

  if (update.status.ccv === 2) {
    setNumberFormGroupToError(".ccv-group");
    clearInputCheckResult(".ccv-group");
    showInputCheckError(".ccv-group", "驗證碼");
  } else if (update.status.ccv === 0) {
    setNumberFormGroupToSuccess(".ccv-group");
    clearInputCheckResult(".ccv-group");
  } else {
    setNumberFormGroupToNormal(".ccv-group");
    clearInputCheckResult(".ccv-group");
  }
};

function setNumberFormGroupToError(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.add("has-error");
  element.classList.remove("has-success");
}
function setNumberFormGroupToSuccess(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.remove("has-error");
  element.classList.add("has-success");
}
function setNumberFormGroupToNormal(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.classList.remove("has-error");
  element.classList.remove("has-success");
}
function clearInputCheckResult(selector) {
  const target = document.querySelector(selector);
  if (!target.lastChild.classList.contains("input-check")) return;
  target.removeChild(target.lastChild);
}
function showInputCheckError(selector, errorText) {
  const target = document.querySelector(selector);
  const errorSpan = document.createElement("span");
  errorSpan.classList.add("input-check");
  errorSpan.innerText = `請輸入正確的${errorText}`;
  target.appendChild(errorSpan);
}
