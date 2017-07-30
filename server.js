const express = require('express');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const users = require('./routes');
const db = require('./db');

const app = express();

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {
  express: app,
  noCache: true
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); // extende
app.use(methodOverride('_method'));

app.get('/', function(req, res, next) {
  db.getUsers(false, function(err, allUsers) {
    if (err) return next(err);
    res.render('index');
  })
});
app.use('/users', users);
app.use(function(err, req, res, next) {
  res.render('error', { message: err });
})



const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}`);
})
