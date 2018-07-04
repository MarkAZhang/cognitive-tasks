'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

require('babel-polyfill');

var _endpoints = require('./endpoints');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var PATH_DIST = _path2.default.resolve(__dirname, 'dist');

app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies
app.use('/static', _express2.default.static(PATH_DIST));

app.get('/*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'index.html'));
});

console.log('Listening at port 8888!');

app.post('/user/get_or_create', _endpoints.getOrCreate);

app.listen(8888);