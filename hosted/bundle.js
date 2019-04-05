"use strict";

//make react comps
// const handleDomo = e => {
//   e.preventDefault();

//   $("#domoMessage").animate({ width: "hide" }, 350);

//   if (
//     $("#domoName").val() == "" ||
//     $("#domoAge").val() == "" ||
//     $("#domoSkill").val() == ""
//   ) {
//     handleError("RAWR! All fields are required");
//     return false;
//   }

//   sendAjax(
//     "POST",
//     $("#domoForm").attr("action"),
//     $("#domoForm").serialize(),
//     function() {
//       loadDomosFromServer();
//     }
//   );

//   return false;
// };

var handleRent = function handleRent(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if ($("#usersRent").val() == "") {
    handleError("Please enter your monthly rent!");
    return false;
  }

  sendAjax("POST", $("#rentForm").attr("action"), $("#rentForm").serialize(), function () {
    loadFinancesFromServer();
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
var RentForm = function RentForm(props) {
  return React.createElement(
    "form",
    {
      id: "rentForm",
      onSubmit: handleRent,
      name: "rentForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "rent" },
      "Rent: "
    ),
    React.createElement("input", { id: "usersRent", type: "text", name: "rent", placeholder: "Rent" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "rentSubmit", type: "submit", value: "Submit Rent" })
  );
};

//react JSX for add domo form
var WageForm = function WageForm(props) {
  return React.createElement(
    "form",
    {
      id: "domoForm",
      onSubmit: handleRent,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "wage" },
      "Salary: "
    ),
    React.createElement("input", {
      id: "usersSalary",
      type: "text",
      name: "salary",
      placeholder: "Salary or Wage per Year"
    }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "wageSubmit", type: "submit", value: "Submit Wage" })
  );
};

//react JSX for add domo form
var ExpenseForm = function ExpenseForm(props) {
  return React.createElement(
    "form",
    {
      id: "domoForm",
      onSubmit: handleRent,
      name: "domoForm",
      action: "/maker",
      method: "POST",
      className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "expenses" },
      "Expenses: "
    ),
    React.createElement("input", {
      id: "usersExpenses",
      type: "text",
      name: "rent",
      placeholder: "Expenses"
    }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "expensesSubmit", type: "submit", value: "Submit Expenses" })
  );
};

// //react JSX for add domo form
// const DomoForm = props => {
//   return (
//     <form
//       id="domoForm"
//       onSubmit={handleDomo}
//       name="domoForm"
//       action="/maker"
//       method="POST"
//       className="domoForm"
//     >
//       <label htmlFor="name">Rent: </label>
//       <input id="usersRent" type="text" name="rent" placeholder="Rent" />
//       <label htmlFor="age">Age: </label>
//       <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
//       <label htmlFor="skill">Skill: </label>
//       <input
//         id="domoSkill"
//         type="text"
//         name="skill"
//         placeholder="Domos Skill"
//       />
//       <input type="hidden" name="_csrf" value={props.csrf} />
//       <input className="makeDomoSubmit" type="submit" value="Make Domo" />
//     </form>
//   );
// };

// const WhatIsADomoWindow = props => {
//   return (
//     <div className="whatIsdomo">
//       <img
//         src="/assets/img/domoface.jpeg"
//         alt="domo face"
//         className="domoFace"
//       />
//       <h3 className="whatIsDomoName">
//         Name: A Domo gets his name from his very own creator
//       </h3>
//       <br />
//       <h3 className="whatIsDomoAge">Age: A Domo lives and never dies.</h3>
//       <br />
//       <h3 className="whatIsDomoSkill">
//         Skill: Domos are legends that are never forgotton with the skills of
//         gods!
//       </h3>
//     </div>
//   );
// };

//determine what to draw
//can update via Ajax and every time state updates page creates UI and shows
var FinanceList = function FinanceList(props) {
  //if empty show no domos yet
  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Finances Recorded Yet"
      )
    );
  }

  //else use map to create UI for each domo stored
  //every domo will generate a domo div and add to domoNodes
  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: "domo" },
      React.createElement(
        "h3",
        { className: "domoName" },
        "Rent: ",
        domo.rent
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
var loadFinancesFromServer = function loadFinancesFromServer() {
  sendAjax("GET", "/getDomos", null, function (data) {
    ReactDOM.render(React.createElement(FinanceList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

//delete all domos
// const deleteDomosFromServer = () => {
//   sendAjax("DELETE", "/deleteDomos", null, data => {
//     ReactDOM.render(<DomoList domos={[]} />, document.querySelector("#domos"));
//   });
// };

// const createWhatIsADomoWindow = csrf => {
//   ReactDOM.render(
//     <WhatIsADomoWindow csrf={csrf} />,
//     document.querySelector("#domos")
//   );
// };

var setup = function setup(csrf) {
  // const whatIsADomoButton = document.querySelector("#whatIsADomoButton");

  // whatIsADomoButton.addEventListener("click", e => {
  //   e.preventDefault();
  //   createWhatIsADomoWindow(csrf);
  //   return false;
  // });

  ReactDOM.render(React.createElement(RentForm, { csrf: csrf }), document.querySelector("#rent"));
  ReactDOM.render(React.createElement(WageForm, { csrf: csrf }), document.querySelector("#wage"));
  ReactDOM.render(React.createElement(ExpenseForm, { csrf: csrf }), document.querySelector("#expenses"));

  ReactDOM.render(React.createElement(FinanceList, { domos: [] }), document.querySelector("#domos"));

  loadFinancesFromServer();
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
