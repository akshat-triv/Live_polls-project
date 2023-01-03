const pg = require('pg');
const { Client } = pg;

const AppError = require('./utils/appError');

const client = new Client({
  host: 'db.nbjbkqzbscimqtguvbcu.supabase.co',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  port: 5432,
});

client.connect(function (err) {
  if (err) console.log(err);
  else console.log('DataBase connected');
});

exports.save = async (obj, which) => {
  const query = {
    text: `INSERT INTO ${which}(${Object.keys(obj).join(
      ','
    )}) VALUES($1, $2, $3, $4)`,
    values: [...Object.values(obj)],
  };

  try {
    await client.query(query);
  } catch (err) {
    return new AppError(err.message, '400');
  }
};

exports.find = async (id, which, callback) => {
  const query = {
    text: `SELECT * FROM ${which} WHERE poll_id = $1`,
    values: [id.poll_id],
  };

  try {
    let data = [];
    const res = await client.query(query);
    for (var i of res.rows) {
      let tmp = { ...i };
      data.push(tmp);
    }
    if (which === 'polls' && data[0]) {
      data = data[0];
    }
    callback(data);
  } catch (err) {
    return new AppError(err.message, '400');
  }
};

exports.update = (obj, which) => {
  client.query(`UPDATE ${which} SET ?`, [obj], function (err) {
    if (err) return new AppError(err.message, '400');
  });
};

exports.deleteAll = (id, which) => {
  client.query(`DELETE FROM ${which} WHERE poll_id = $1`, [id], function (err) {
    if (err) return new AppError(err.message, '400');
  });
};

exports.vote = (id, which) => {
  const columnName = which === 'options' ? 'option_id' : 'poll_id';

  client.query(
    `UPDATE ${which} SET votes=votes+1 WHERE ${columnName} = $1`,
    [id],
    function (err) {
      if (err) return new AppError(err.message, '400');
    }
  );
};
