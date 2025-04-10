module.exports = function(io) {
  const users = {};
  const messageHistory = [];

  io.on('connection', (socket) => {
    console.log("Nouvel utilisateur connecté");

    // Quand un user se connecte avec pseudo et avatar
    socket.on('user-joined', ({ pseudo, avatar }) => {
      users[socket.id] = { pseudo, avatar };

      // Mise à jour globale de la liste des utilisateurs
      io.emit('update-users', Object.values(users).map(u => u.pseudo));
    });

    // Quand un message est envoyé
    socket.on('chat-message', (text) => {
      const userData = users[socket.id];
      if (!userData) return;

      const message = {
        user: userData.pseudo,
        avatar: userData.avatar,
        text
      };

      messageHistory.push(message);
      if (messageHistory.length > 100) messageHistory.shift();

      io.emit('chat-message', message);
    });

    // Déconnexion d’un user
    socket.on('disconnect', () => {
      delete users[socket.id];
      io.emit('update-users', Object.values(users).map(u => u.pseudo));
    });
  });
};
