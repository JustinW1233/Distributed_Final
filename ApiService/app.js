var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {initialize} = require('express-openapi');

var app = express();

initialize({
    app,
    apiDoc: require('./api/api-doc'),
    paths: './api/paths',
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.listen(6969)

module.exports = app;
