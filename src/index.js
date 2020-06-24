const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', () => {
  console.log('A new player just connected');
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
