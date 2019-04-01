const models = require("../models");

const Domo = models.Domo;

const makerPage = (req, res) => {
  // grab all Domos for user based on user id in their session
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occured" });
    }
    return res.render("app", { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.skill) {
    return res
      .status(400)
      .json({ error: "RAWR! Both name, age and skill are required" });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    skill: req.body.skill,
    owner: req.session.account._id
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: "/maker" }));

  domoPromise.catch(err => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Domo already exists." });
    }
    return res.status(400).json({ error: "An error occurred" });
  });

  return domoPromise;
};

// get json responses of domos for a user
// update dynamically using REACT, pair data on screen to data from this func
// no reloading of page grab updates from server and immediately update UI
const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occured" });
    }

    return res.json({ domos: docs });
  });
};

// const deleteDomos = (request, response) => {
//   const req = request;
//   const res = response;

//   return Domo.DomoModel.deleteDomos(req.session.account._id, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error occured' });
//     }

//     return res.json({ domos: docs });
//   });
// };

const deleteDomos = (req, res) => {
  console.log("in controller");
  // grab all Domos for user based on user id in their session
  Domo.DomoModel.deleteDomos(req.session.account._id, (err, docs) => {
    if (err) {
      console.log("err");
      console.log(err);
      return res.status(400).json({ error: "An error occured" });
    }
    return res.render("app", { csrfToken: req.csrfToken(), domos: docs });
  });
};

const whatIsDomosPage = (req, res) => {
  res.render("whatIsDomo", { csrfToken: req.csrfToken() });
};

module.exports.makerPage = makerPage;
module.exports.whatIsDomosPage = whatIsDomosPage;
module.exports.getDomos = getDomos;
module.exports.deleteDomos = deleteDomos;
module.exports.make = makeDomo;
