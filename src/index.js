const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const formatMessage = require('./utils/formatMessage.js');

const {
  addPlayer,
  getAllPlayers,
  getPlayer,
  removePlayer,
} = require('./utils/players.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('A new player just connected');

  socket.on('join', ({ playerName, room }, callback) => {
    const { error, newPlayer } = addPlayer({ id: socket.id, playerName, room });

    if (error) return callback(error.message);
    callback();

    socket.join(newPlayer.room);

    socket.emit('message', formatMessage('Admin', 'Welcome!'));

    socket.broadcast
      .to(newPlayer.room)
      .emit(
        'message',
        formatMessage('Admin', `${newPlayer.playerName} has joined the game!`)
      );
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
