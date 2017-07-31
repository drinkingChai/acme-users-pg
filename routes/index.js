const router = require('express').Router();
const db = require('../db');

router.get('/', function(req, res, next) {
  db.getUsers()
    .then(function(allUsers) {
      res.render('users', { allUsers });
    }, function(err) {
      next(err);
    })
})

router.post('/', function(req, res, next) {
  var user = { name: req.body.name, isManager: req.body.isManager ? req.body.isManager : false };
  db.createUser(user)
    .then(function() {
      user.isManager ? res.redirect('/users/managers') : res.redirect('/users');
    }, function(err) {
      next(err);
    });
})

router.put('/:id', function(req, res, next) {
  db.getUser(req.params.id*1)
    .then(function(result) {
      var user = { name: result[0].name, isManager: result[0].is_manager };
      req.body['promote'] ? user.isManager = true : user.isManager = false;
      return db.updateUser(user);
    })
    .then(function(user) {
      user[0].is_manager ? res.redirect('/users/managers') : res.redirect('/users');
    })
    .catch(function(err) {
      next(err);
    });
})

router.delete('/:id', function(req, res, next) {
  db.deleteUser(req.params.id*1)
    .then(function() {
      res.redirect('/users');
    })
    .catch(function(err) {
      next(err);
    });
})

router.get('/managers', function(req, res, next) {
  db.getUsers(true)
    .then(function(allUsers) {
      res.render('managers', { allUsers });
    }, function(err) {
      next(err);
    });
})


module.exports = router;
