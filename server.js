const express = require('express');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const users = require('./routes');

const app = express();

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure({
  express: app,
  noCache: true
});

app.use(bodyParser.urlencoded({ extended: false })); // extende
app.use(methodOverride('_method'));

app.get('/', function(req, res) { res.redirect('/users') });
app.use('/users', users);



const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}`);
})
