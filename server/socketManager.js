module.exports = function(io) {
  const users = {};
  const usernames = new Set();
  const messageHistory = [];

  io.on('connection', (socket) => {
    console.log(' Nouvelle connexion');

    const pseudo = "User#" + socket.id.slice(0, 4);
    users[socket.id] = pseudo;
    usernames.add(pseudo);

    socket.emit('init', {
      users: Array.from(usernames),
      messages: messageHistory
    });

    socket.broadcast.emit('user-joined', pseudo);
    io.emit('update-users', Array.from(usernames));

    socket.on('chat-message', (msg) => {
      const username = users[socket.id];
      if (!username) return;

      const message = {
        user: username,
        text: msg
      };

      messageHistory.push(message);
      if (messageHistory.length > 100) messageHistory.shift();

      io.emit('chat-message', message);
    });

    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        usernames.delete(username);
        delete users[socket.id];
        socket.broadcast.emit('user-left', username);
        io.emit('update-users', Array.from(usernames));
      }
    });
  });
};
