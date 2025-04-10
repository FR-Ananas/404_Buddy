module.exports = function(io) {
  const users = {};
  const usernames = new Set();
  const messageHistory = [];

  io.on('connection', (socket) => {
    console.log('🟢 Nouvelle connexion');

    socket.on('login', (username, callback) => {
      if (usernames.has(username)) {
        return callback({ success: false, message: "Pseudo déjà utilisé" });
      }

      users[socket.id] = username;
      usernames.add(username);
      console.log(`✅ ${username} connecté`);

      socket.emit('init', {
        users: Array.from(usernames),
        messages: messageHistory
      });

      socket.broadcast.emit('user-joined', username);
      io.emit('update-users', Array.from(usernames));

      callback({ success: true });
    });

    socket.on('chat-message', (msg) => {
      const username = users[socket.id];
      if (!username) return;

      const message = {
        user: username,
        text: msg
        // ⛔️ pas de time ici → horodatage côté client
      };

      messageHistory.push(message);
      if (messageHistory.length > 100) messageHistory.shift();

      io.emit('chat-message', message);
    });

    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        console.log(`🔴 ${username} déconnecté`);
        usernames.delete(username);
        delete users[socket.id];
        socket.broadcast.emit('user-left', username);
        io.emit('update-users', Array.from(usernames));
      }
    });
  });
};
