var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {initialize} = require('express-openapi');
const promBundle = require('express-prom-bundle')

var app = express();

const metricsMiddelWare = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: {project_name: 'apiservice1', project_type: 'apiservice1_service'},
    promClient: {
        collectDefaultMetrics: {}
    }
})

app.use(metricsMiddelWare);

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

app.listen(6969)

module.exports = app;
