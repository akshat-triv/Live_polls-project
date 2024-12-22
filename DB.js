const pg = require('pg');
const { Client } = pg;

const AppError = require('./utils/appError');

let DATABASE_CONNECTED = false;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('DataBase connected');
  DATABASE_CONNECTED = true;
});

exports.save = async (obj, which) => {
  if (!DATABASE_CONNECTED) {
    callback(
      new AppError('Database is turned off, please start it in Supabase', 500)
    );
    return;
  }

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
  if (!DATABASE_CONNECTED) {
    callback(
      new AppError('Database is turned off, please start it in Supabase', 500)
    );
    return;
  }

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
  if (!DATABASE_CONNECTED) {
    callback(
      new AppError('Database is turned off, please start it in Supabase', 500)
    );
    return;
  }

  client.query(`UPDATE ${which} SET ?`, [obj], function (err) {
    if (err) return new AppError(err.message, '400');
  });
};

exports.deleteAll = (id, which) => {
  if (!DATABASE_CONNECTED) {
    callback(
      new AppError('Database is turned off, please start it in Supabase', 500)
    );
    return;
  }

  client.query(`DELETE FROM ${which} WHERE poll_id = $1`, [id], function (err) {
    if (err) return new AppError(err.message, '400');
  });
};

exports.vote = (id, which) => {
  if (!DATABASE_CONNECTED) {
    callback(
      new AppError('Database is turned off, please start it in Supabase', 500)
    );
    return;
  }
  const columnName = which === 'options' ? 'option_id' : 'poll_id';

  client.query(
    `UPDATE ${which} SET votes=votes+1 WHERE ${columnName} = $1`,
    [id],
    function (err) {
      if (err) return new AppError(err.message, '400');
    }
  );
};
