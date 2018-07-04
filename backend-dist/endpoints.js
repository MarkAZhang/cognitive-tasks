'use strict';

var _datastore = require('@google-cloud/datastore');

var _datastore2 = _interopRequireDefault(_datastore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var projectId = 'cognitive-tasks';

var datastore = new _datastore2.default({
  projectId: projectId
});

var createNewUser = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(awsId) {
    var key, entity;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = datastore.key('User');
            entity = {
              key: key,
              data: awsId ? { awsId: awsId } : {}
            };
            _context.next = 4;
            return datastore.insert(entity);

          case 4:
            return _context.abrupt('return', key);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createNewUser(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getOrCreate = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var userKey, query, response, _userKey;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.body.awsId) {
              _context2.next = 8;
              break;
            }

            _context2.next = 3;
            return createNewUser();

          case 3:
            userKey = _context2.sent;

            res.json({
              userId: userKey.id,
              status: 'new'
            });
            return _context2.abrupt('return');

          case 8:
            query = datastore.createQuery('User').filter('awsId', '=', req.body.awsId);
            _context2.next = 11;
            return datastore.runQuery(query);

          case 11:
            response = _context2.sent;

            if (!(response[0].length > 0)) {
              _context2.next = 16;
              break;
            }

            res.json({
              userId: response[0][0][_datastore2.default.KEY].id,
              status: 'existing'
            });
            _context2.next = 20;
            break;

          case 16:
            _context2.next = 18;
            return createNewUser(req.body.awsId);

          case 18:
            _userKey = _context2.sent;

            res.json({
              userId: _userKey.id,
              status: 'new'
            });

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getOrCreate(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  getOrCreate: getOrCreate
};