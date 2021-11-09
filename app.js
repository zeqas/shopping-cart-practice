const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// view engine setup
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}));

app.use(logger('dev'));
app.use(express.json());