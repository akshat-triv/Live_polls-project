const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const morgan = require('morgan');
const pollRouter = require('./routes/pollRouter');
const viewRouter = require('./routes/viewRouter');
const globalErrorController = require('./controllers/errorController');
const AppError = require('./utils/appError');

const workspace = io.of(/^\/\w+$/);

workspace.on('connection', (socket) => {
  const name = socket.nsp.name;
  socket.on('voteIncoming', (id, space) => {
    //console.log({ voteIncoming: id });
    io.of(space).emit('voteOut', id);
  });
  socket.emit('connected', name);
});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/poll', pollRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't process ${req.originalUrl}`, 404));
});

app.use(globalErrorController);

module.exports = server;
