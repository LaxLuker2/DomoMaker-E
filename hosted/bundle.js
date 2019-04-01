"use strict";

//make react comps
var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoSkill").val() == "") {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var deleteDomo = function deleteDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  console.log("delete all");

  sendAjax("DELETE", $("#deleteDomo").attr("action"), function () {
    deleteDomosFromServer();
  });

  return false;
};

//react JSX for add domo form
var DomoForm = function DomoForm(props) {
  return (
    //(
    React.createElement(
      "div",
      { className: "forms" },
      React.createElement(
        "form",
        {
          id: "domoForm",
          onSubmit: handleDomo,
          name: "domoForm",
          action: "/maker",
          method: "POST",
          className: "domoForm"
        },
        React.createElement(
          "label",
          { htmlFor: "name" },
          "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
          "label",
          { htmlFor: "age" },
          "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
          "label",
          { htmlFor: "skill" },
          "Skill: "
        ),
        React.createElement("input", {
          id: "domoSkill",
          type: "text",
          name: "skill",
          placeholder: "Domos Skill"
        }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
      )
    )
  );
};

var WhatIsADomoWindow = function WhatIsADomoWindow(props) {
  return React.createElement(
    "div",
    { className: "whatIsdomo" },
    React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }),
    React.createElement(
      "h3",
      { className: "whatIsDomoName" },
      "Name: A Domo gets his name from his very own creator"
    ),
    React.createElement("br", null),
    React.createElement(
      "h3",
      { className: "whatIsDomoAge" },
      "Age: A Domo lives and never dies."
    ),
    React.createElement("br", null),
    React.createElement(
      "h3",
      { className: "whatIsDomoSkill" },
      "Skill: Domos are legends that are never forgotton with the skills of gods!"
    )
  );
};

//determine what to draw
//can update via Ajax and every time state updates page creates UI and shows
var DomoList = function DomoList(props) {
  //if empty show no domos yet
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Domos Yet"
      )
    );
  }

  //else use map to create UI for each domo stored
  //every domo will generate a domo div and add to domoNodes
  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: "domo" },
      React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "domo face",
        className: "domoFace"
      }),
      React.createElement(
        "h3",
        { className: "domoName" },
        "Name: ",
        domo.name
      ),
      React.createElement(
        "h3",
        { className: "domoAge" },
        "Age: ",
        domo.age
      ),
      React.createElement(
        "h3",
        { className: "domoSkill" },
        "Skill: ",
        domo.skill
      )
    );
  });
  //render out a domoList with our domoNodes array
  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

//grab domos from server and render a Domolist
//since async we need to render on success
var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax("GET", "/getDomos", null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

//delete all domos
var deleteDomosFromServer = function deleteDomosFromServer() {
  sendAjax("DELETE", "/deleteDomos", null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));
  });
};

var createWhatIsADomoWindow = function createWhatIsADomoWindow(csrf) {
  ReactDOM.render(React.createElement(WhatIsADomoWindow, { csrf: csrf }), document.querySelector("#domos"));
};

var setup = function setup(csrf) {
  var whatIsADomoButton = document.querySelector("#whatIsADomoButton");

  whatIsADomoButton.addEventListener("click", function (e) {
    e.preventDefault();
    createWhatIsADomoWindow(csrf);
    return false;
  });

  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

  loadDomosFromServer();
};

//get csrf token
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
  $("#domoMessage").animate({ width: "toggle" }, 350);
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
