const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const _ = require("underscore");

let DomoModel = {};

// mongoose.Types.ObjectID is a function that
// converts stringID to real mongoID
const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName
  },

  age: {
    type: Number,
    min: 0,
    required: true
  },

  skill: {
    type: String,
    required: true,
    trim: true
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Account"
  },

  createdData: {
    type: Date,
    default: Date.now
  }
});

DomoSchema.statics.toAPI = doc => ({
  name: doc.name,
  age: doc.age,
  skill: doc.skill
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId)
  };

  return DomoModel.find(search)
    .select("name age skill")
    .exec(callback);
};

DomoSchema.statics.deleteDomos = (ownerId, callback) => {
  console.log("in models");
  const search = {
    owner: convertId(ownerId)
  };

  // db.users.deleteMany({ status : "A" })

  // DomoModel.remove({ search }).exec(callback);

  return DomoModel.remove({ search }).exec(callback);
};

DomoModel = mongoose.model("Domo", DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
