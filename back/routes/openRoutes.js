'use strict';
const Router = require('koa-router');
const config = require('config');
const rp = require('request-promise');
const bcrypt = require('bcrypt-promise');

let TrakerUser = require('../db/trackerUserData');
let SpotifyUser = require('../db/spotifyUserData');
let token = new TrakerUser();

const allPublicRoutes = new Router();

// render index page
allPublicRoutes.get('/', function *(){
  this.render('index');
});

allPublicRoutes.get('/user/:id', function *(){
  let id = this.params.id;

  yield SpotifyUser.find({'user.id':id})
  .then((data) => {
    if(data && data.length !== 0) {
      console.log(data);
      return this.body = data[0].user;
    }

    this.throw(400, {message: "Sorry, user " + id + ' doesn`t exist'});
  })
  .catch((err) => {
    this.throw( err.status, {
      message: err.message
    });
  });
});

//check same user
allPublicRoutes.post('/user', function *(){
  let body = this.request.body;
  yield TrakerUser.find({email: body.email})
    .then((res) => {
      console.log(1, res);
      if(res && res.length === 0) {
        return this.body = {
          status: 'ok',
          email: body.email
        }
      }
      this.throw(409, {message: "Sorry, user with email " + body.email + ' already present'});
    })
    .catch((err) => {
      console.log(err);
      this.throw( err.status, {
        message: err.message
      });
    });
});

//register new user
allPublicRoutes.post('/user/register', function *(){
  let body = this.request.body;

  let salt = yield bcrypt.genSalt(10);
  let hash = yield bcrypt.hash(body.password, salt);
  let userToken = token.generateToken({date: Date.now() + Math.random(), host: this.hostname}, config.get('client_id'));

  let newUser = new TrakerUser({
    email: body.email,
    password: hash,
    userToken: userToken
  });

  yield newUser.save()
    .then((res) => {
      this.body = {
        status: true,
        role: res['user_role'],
        email: res.email,
        id: res._id,
        token: res.userToken
      };
    })
    .catch((err) => {
      this.throw( err.status, {
        message: err.message
      });
    });

});

//user login
allPublicRoutes.post('/user/login', function *() {
  let reqUser = this.request.body;
  let user;

  yield TrakerUser.find({email: reqUser.email})
    .then((res) => {
      if (res && res.length !== 0) {
        user = res[0].toObject();
      }
    })
    .catch(() => {
      return this.throw(401, {message: "Sorry, wrong credentials for " + user.email});
    });

  let equalsPass = yield bcrypt.compare(reqUser.password, user.password);
  if (equalsPass) {

    let userToken = token.generateToken({date: Date.now() + Math.random(), host: this.hostname}, config.get('client_id'));

    yield  TrakerUser.update({_id: user._id}, {userToken: userToken})
      .then(() => {
        user.userToken = userToken;
        delete user.password;
        return this.body = user;
      });

  } else {
      this.throw(401, {message: "Sorry, wrong credentials for " + user.email});
  }
});


//user logout
allPublicRoutes.post('/user/logout', function *() {
  let reqUser = this.request.body;
  yield  TrakerUser.update({_id: reqUser._id}, {userToken: 'expired'})
    .then(() => {
      this.body = {};
    });
});


//search info on spotify
allPublicRoutes.post('/search', function *(){
  let body = this.request.body;

  let typeString = Object.keys(body.searchTypes).filter((key) => {
    return body.searchTypes[key] === true;
  });

  let options = {
    method: 'GET',
    uri: 'https://api.spotify.com/v1/search',
    qs:{
      "q": body.searchText,
      "type": typeString.join(',')
    },
    json: true
  };

  yield  rp(options)
    .then((res) => {
      return this.body = {data: res, classes: ['alert-success']};
    }).catch((e) => {
      this.throw(400, 'Some thing going wrong on search req');
    })

});

//auth https://accounts.spotify.com/authorize
allPublicRoutes.get('/connect', function *(){
  let uri = 'https://accounts.spotify.com/authorize?';
  let qs = 'client_id=' + config.get('client_id') +
    '&redirect_uri=' + config.get('redirect_uri') +
    '&response_type=code&scope=user-read-private user-read-email user-library-read';

  this.body=({url: (uri + qs)});
});

// getting auth token
allPublicRoutes.get('/aftercode', function *(){
  let spotifyUserData = {};
  let code = this.query.code;
  let spotTokenReq = {
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    form:{
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.get('redirect_uri')
    },
    json: true,
    headers: {
      "Authorization": 'Basic ' + (new Buffer(config.get('client_id') + ':' + config.get('client_secret')).toString('base64'))
    }
  };

  let spotUserDataReq = {};

  yield rp(spotTokenReq)
    .then((tokens) => {
      spotifyUserData.tokens = tokens;
      spotUserDataReq = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + tokens.access_token },
        json: true
      };
    })
    .catch((e) => {
      this.throw(400, 'Some thing going wrong on spotTokenReq');
    });

  let newSpotifyUser;

  yield rp(spotUserDataReq)
    .then((user) => {
      spotifyUserData.user = user;
      newSpotifyUser = new SpotifyUser({
        user: spotifyUserData.user,
        tokens: spotifyUserData.tokens
      });
    })
    .catch((e) => {
      this.throw(400, 'Some thing going wrong on spotUserDataReq');
    });


  yield newSpotifyUser.save()
  .then((res) => {
    this.redirect('http://localhost:5300/#/user/' + spotifyUserData.user.id);
    return this.body = {status:'ok'};
  })
  .catch((err) => {
    this.throw( err.status, {
      message: err.message
    });
  });

});

module.exports = allPublicRoutes;