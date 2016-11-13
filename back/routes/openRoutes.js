'use strict';
const Router = require('koa-router');
const allPublicRoutes = new Router();
const rp = require('request-promise');

const config = require('config');
const queryString = require('query-string');

let i=0;

// render index page
allPublicRoutes.get('/', function *(){
  this.render('index');
});

// render index page
allPublicRoutes.get('/home', function *(){
  let code = this.query.code;

  console.log(code);

  let options = {
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

  yield rp(options)
    .then((res) => {
      console.log('=====================================');
      console.log(res);
      this.body = {status: 'ok'};
      this.redirect('http://localhost:5300/#/home');

      // return this.body = {data: res, classes: ['alert-success']};
    }).catch((e) => {
      console.log(e);
      console.log('---------------------------------------------');
      this.throw(400, 'Some thing going wrong');
    });

});


//search route
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
      console.log('=====================================');
      return this.body = {data: res, classes: ['alert-success']};
    }).catch((e) => {
      this.throw(400, 'Some thing going wrong');
      console.log('---------------------------------------------');
    })

});

//auth https://accounts.spotify.com/authorize
allPublicRoutes.get('/login', function *(){
  let options = {
    method: 'GET',
    uri: 'https://accounts.spotify.com/authorize?',
    qs:{
      "client_id": config.get('client_id'),
      "response_type": 'code',
      "redirect_uri": config.get('redirect_uri'),
      "scope": 'user-read-private user-read-email'
    },
    headers: {
     'content-type': 'text/html;charset=utf-8'
    }
  };
  this.body=({url: (options.uri) + queryString.stringify(options.qs)});
});


module.exports = allPublicRoutes;