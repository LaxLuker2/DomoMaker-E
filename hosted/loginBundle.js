"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "form",
    {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign In" })
  );
};

var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "form",
    {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
  );
};

//render the pages in react
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

//attach events to the page btns
//user hits login or signup pgs UI re-render with correct html w/out changing pg
//default to LoginWindow view
var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); //default view
};

//get new CSRF token
var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

//pg loads get token and setup the rest of the page to show our react components
$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  // $("#domoMessage").animate({ width: "toggle" }, 350);
  alert(message);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: "hide" }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
