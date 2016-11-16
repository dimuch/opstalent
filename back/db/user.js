'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const crypto = require('crypto');

let db = mongoose.createConnection('mongodb://localhost/spotify');

let personSchema = new mongoose.Schema({
  'email': {
    type: String,
    required: true,
    unique: true
  },
  'password': {
    type: String,
    required: true
  },
  'spotify_id': {
    type: String,
    unique: false,
    default: 'Spotify_some_id' + Date.now() + Math.random() * 100
  },
  'userToken': {
    type: String,
    unique: false,
    default: ''
  }
  // ,twitter_id: String,
  // google_id: String
});

personSchema.methods.generateToken = (payload, secret) => {
  let algorithm = 'HS256';
  let header = {
    typ: 'JWT',
    alg: algorithm
  };

  let jwt = base64Encode(JSON.stringify(header)) + '.' + base64Encode(JSON.stringify(payload));
  return jwt + '.' + sign(jwt, secret);

};

let sign = (str, key) => {
  return crypto.createHmac('sha256', key).update(str).digest('base64');
};

let base64Encode = (str) => {
  return new Buffer(str).toString('base64');
};


module.exports = db.model("Person", personSchema);