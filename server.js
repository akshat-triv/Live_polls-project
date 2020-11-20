const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const server = require('./app');

process.on('uncaughtException', (err) => {
  console.log('Uncaught ExceptionShutting down the server');
  console.log(`${err.name}:${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  server.close(() => {
    process.exit(1);
  });
});

const port = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.log('Unhandeled Rejection Shutting down the server');
  console.log(`${err.name}:${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  server.close(() => {
    process.exit(1);
  });
});

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});
