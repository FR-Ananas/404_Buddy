module.exports = function(io) {
  const users = {};

  io.on('connection', (socket) => {
    console.log('🔌 Nouvel utilisateur connecté');

    socket.on('login', (username) => {
      users[socket.id] = username;
      socket.broadcast.emit('user-joined', username);
    });

    socket.on('chat-message', (msg) => {
      const username = users[socket.id];
      io.emit('chat-message', { user: username, text: msg });
    });

    socket.on('disconnect', () => {
      const username = users[socket.id];
      socket.broadcast.emit('user-left', username);
      delete users[socket.id];
    });
  });
};
