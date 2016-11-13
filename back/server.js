'use strict';

const koa = require('koa');
const app = koa();

//logger
const logger = require('koa-logger');
app.use(logger());

const favicon = require('koa-favicon');
app.use(favicon(__dirname + './front/favicon.ico'));

//errors
app.use(require('./libs/errors'));

// body-parser
const bodyParser = require('koa-body');
app.use(bodyParser());

//helmet
const helmet = require('koa-helmet');
app.use(helmet());

//static
const serve = require('koa-static');
app.use(serve('./front'));

//render
require('./libs/render')(app);

//routes
let router = require('./routes/openRoutes');
app.use(router.routes());


app.listen(5300);

console.log('server is running on 5300...');



// const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
// middlewares.forEach(middleware => app.use(require('./middlewares/' + middleware)));
//
// require('./routes')(app);
// require('./libs/socket')(app);
