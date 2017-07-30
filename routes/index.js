const router = require('express').Router();
const db = require('../db');

router.get('/', function(req, res, next) {
  db.getUsers(false, function(err, allUsers) {
    if (err) return next(err);
    res.render('users', { allUsers });
  })
})

router.post('/', function(req, res, next) {
  var user = { name: req.body.name, isManager: req.body.isManager ? req.body.isManager : false };
  db.createUser(user, function(err) {
    if (err) return next(err);
    user.isManager ? res.redirect('/users/managers') : res.redirect('/users');
  })
})

router.put('/:id', function(req, res, next) {
  db.getUser(req.params.id*1, function(err, result) {
    if (err) return next(err);
    var user = { name: result.name, isManager: result.is_manager };
    req.body['promote'] ? user.isManager = true : user.isManager = false;
    db.updateUser(user, function(err) {
      if (err) return next(err);
      user.isManager ? res.redirect('/users/managers') : res.redirect('/users');
    })
  })
})

router.delete('/:id', function(req, res, next) {
  db.deleteUser(req.params.id*1, function(err) {
    if (err) return next(err);
    res.redirect('/users');
  })
})

router.get('/managers', function(req, res, next) {
  db.getUsers(true, function(err, allUsers) {
    if (err) return next(err);
    res.render('managers', { allUsers });
  })
})


module.exports = router;
