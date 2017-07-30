const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

function query(sql, vals, fn) {
  // middleware! helper function
  client.query(sql, vals, fn);
}

function sync(cb) {
  var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(40) UNIQUE NOT NULL,
      is_manager BOOLEAN NOT NULL DEFAULT false
    );
  `
  query(sql, null, function(err) {
    cb(err);
  })
}

function seed(cb) {
  createUser({ name: 'Joe', isManager: true }, cb);
  createUser({ name: 'Moe', isManager: false }, cb);
  createUser({ name: 'Shloe', isManager: true }, cb);
  cb('success'); // for testing
}

function getUsers(managersOnly, cb) {
  var sql = 'SELECT * FROM users' + (managersOnly ? ' WHERE is_manager' : '');
  query(sql, null, function(err, results) {
    if (err) return cb(err);
    cb(null, results.rows);
  });
}

function getUser(id, cb) {
  query('SELECT * FROM users WHERE id=$1', [id], function(err, results) {
    if (err) return cb(err);
    cb(null, results.rows[0]);
  })
}

function createUser(user, cb) {
  query('INSERT INTO users (name, is_manager) VALUES ($1, $2)', [user.name, user.isManager], function(err) {
    if (err) return cb(err);
    cb();
  });
}

function updateUser(user, cb) {
  query('UPDATE users SET name=$1, is_manager=$2 WHERE name=$1', [user.name, user.isManager], function(err) {
    if (err) return cb(err);
    cb();
  });
}

function deleteUser(id, cb) {
  query('DELETE FROM users WHERE id=$1', [id], function(err) {
    if (err) return cb(err);
    cb();
  })
}


client.connect();

module.exports = {
  sync,
  seed,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}

sync(function(err) {
  if (err) return console.log(err);
  seed(function(err) {
    if (err) return console.log(err);
    // tests
    // getUser(1, console.log);
    // updateUser({ name: 'Joe', isManager: false }, console.log);
    // deleteUser(3, console.log);
    // getUsers(false, console.log);
  })
});
