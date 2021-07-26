const mysql = require('mysql');
const AppError = require('./utils/appError');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  insecureAuth: true,
});

connection.connect(function (err) {
  if (err) console.log(err);
  if (!err) console.log('DataBase connected');
});

exports.save = (obj, which) => {
  let poll = { ...obj };
  connection.query(
    `INSERT INTO ${which} SET ?`,
    poll,
    function (err, result, field) {
      if (err) return new AppError(err.message, '400');
      //console.log(result);
    }
  );
};

exports.find = (id, which, callback) => {
  let data = [];
  connection.query(
    `SELECT * FROM ${which} WHERE ?`,
    id,
    function (err, res, field) {
      if (err) return new AppError(err.message, '400');
      //console.log(res);
      for (var i of res) {
        let tmp = { ...i };
        data.push(tmp);
      }
      if (which === 'polls') {
        if (data[0]) data = data[0];
      }
      callback(data);
    }
  );
};

exports.update = (obj, which) => {
  connection.query(`UPDATE ${which} SET ?`, obj, function (err, res, field) {
    if (err) return new AppError(err.message, '400');
  });
};

exports.deleteAll = (obj, which) => {
  const query = connection.query(
    `DELETE FROM ${which} WHERE ?`,
    obj,
    function (err, res, field) {
      if (err) return new AppError(err.message, '400');
    }
  );
};

exports.vote = (id, which) => {
  let tmp = {};
  if (which === 'options') {
    tmp = { option_id: id };
  } else {
    tmp = { poll_id: id };
  }

  connection.query(
    `UPDATE ${which} SET votes=votes+1 WHERE ?`,
    tmp,
    function (err, res, field) {
      if (err) return new AppError(err.message, '400');
    }
  );
};
