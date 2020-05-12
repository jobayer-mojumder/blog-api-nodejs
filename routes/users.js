var express = require('express');
var router = express.Router();

var user = require('../models/user');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var superSecret = 'blogangularnodejs';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/adduser', function (req, res, next) {

  var data = req.body;
  user.findByUsername(data.username, function (err, rows, fields) {
    if (rows.length == 1) {
      user.sendResponse(false, res);
    } else {
      user.encrypt(data, function (err, hash) {
        data.hashedpassword = hash;
        delete data.password;
        user.addUser(data, function (err, info) {
          user.sendResponse(true, res);
        });
      });
    };
  });
});

router.post('/deleteuser', function (req, res, next) {

  var data = req.body;
  user.findByUsername(data.username, function (err, rows, fields) {
    if (rows.length !== 1) {
      user.sendResponse(false, res);
    } else {
      user.deleteUser(data.username, function (err, info) {
        user.sendResponse(true, res);
      });
    };
  });
});


router.post('/login', function (req, res, next) {

  var data = req.body;
  user.findByUsername(data.username, function (err, rows, fields) {
    if (rows.length !== 1) {
      user.sendResponse(false, res);
    } else {
      var str = JSON.stringify(rows);
      rows = JSON.parse(str);
      if (rows.length > 0) {
        var compare = bcrypt.compare(data.password, rows[0].hashedpassword, function (err, resp) {
          if (resp) {
            var payload = {
              username: data.username,
            }
            var token = jwt.sign(payload, superSecret, {
              expiresIn: 86400 // expires in 24 hours
            });
            delete rows[0].hashedpassword;
            rows[0].token = token;
            res.json({
              success: true,
              user: rows[0]
            });
          } else {
            user.sendResponse(false, res);
          }
        });
      } else {
        user.sendResponse(false, res);
      }
    };
  });
});


module.exports = router;
