'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let db = mongoose.createConnection('mongodb://localhost/spotifyUserData');

let spotifyUser = new mongoose.Schema({
  'user': {
    type: Object
  },
  'tokens': {
    type: Object
  }
});


module.exports = db.model("spotifyUser", spotifyUser);