//render

const Pug = require('koa-pug');

module.exports = function (app) {
  new Pug({
    viewPath: './front/assets/view/',
    basedir: './front',
    app: app
  });
};