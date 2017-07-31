const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

function queryPromise(sql, vals) {
  // middleware! helper function
  return new Promise(function(resolve, reject) {
    client.query(sql, vals, function(err, result) {
      if (err) return reject(err);
      resolve(result.rows);
    });
  })
}

function sync() {
  var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(40) UNIQUE NOT NULL,
      is_manager BOOLEAN NOT NULL DEFAULT false
    );
  `
  return queryPromise(sql, null);
}

function seed() {
  createUser({ name: 'Joe', isManager: true });
  createUser({ name: 'Moe', isManager: false });
  createUser({ name: 'Shloe', isManager: true });
}

function getUsers(managersOnly) {
  var sql = 'SELECT * FROM users' + (managersOnly ? ' WHERE is_manager' : '');
  return queryPromise(sql, null);
}

function getUser(id) {
  return queryPromise('SELECT * FROM users WHERE id=$1', [id]);
}

function createUser(user) {
  return queryPromise('INSERT INTO users (name, is_manager) VALUES ($1, $2)', [user.name.trim() != '' ? user.name : null, user.isManager]);
}

function updateUser(user) {
  return queryPromise('UPDATE users SET name=$1, is_manager=$2 WHERE name=$1 returning is_manager', [user.name, user.isManager]);
}

function deleteUser(id) {
  return queryPromise('DELETE FROM users WHERE id=$1', [id]);
}


client.connect(function(err) {
  if (err) throw err;
});

module.exports = {
  sync,
  seed,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}


sync().then(function() {
  seed();
});
