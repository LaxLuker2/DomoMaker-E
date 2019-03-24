//make react comps
const handleDomo = e => {
  e.preventDefault();

  $("#domoMessage").animate({ width: "hide" }, 350);

  if (
    $("#domoName").val() == "" ||
    $("#domoAge").val() == "" ||
    $("#domoSkill").val() == ""
  ) {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    $("#domoForm").attr("action"),
    $("#domoForm").serialize(),
    function() {
      loadDomosFromServer();
    }
  );

  return false;
};

//react JSX for add domo form
const DomoForm = props => {
  return (
    <form
      id="domoForm"
      onSubmit={handleDomo}
      name="domoForm"
      action="/maker"
      method="POST"
      className="domoForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
      <label htmlFor="skill">Skill: </label>
      <input
        id="domoSkill"
        type="text"
        name="skill"
        placeholder="Domos Skill"
      />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
  );
};

//determine what to draw
//can update via Ajax and every time state updates page creates UI and shows
const DomoList = function(props) {
  //if empty show no domos yet
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }

  //else use map to create UI for each domo stored
  //every domo will generate a domo div and add to domoNodes
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo">
        <img
          src="/assets/img/domoface.jpeg"
          alt="domo face"
          className="domoFace"
        />
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoSkill">Skill: {domo.skill}</h3>
      </div>
    );
  });
  //render out a domoList with our domoNodes array
  return <div className="domoList">{domoNodes}</div>;
};

//grab domos from server and render a Domolist
//since async we need to render on success
const loadDomosFromServer = () => {
  sendAjax("GET", "/getDomos", null, data => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector("#makeDomo")
  );

  ReactDOM.render(<DomoList domos={[]} />, document.querySelector("#domos"));

  loadDomosFromServer();
};

//get csrf token
const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

//pg loads get token and setup the rest of the page to show our react components
$(document).ready(function() {
  getToken();
});
