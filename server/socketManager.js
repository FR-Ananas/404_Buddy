module.exports = function (io) {
  const users = [];

  io.on("connection", (socket) => {
    console.log("Nouvelle connexion socket:", socket.id);

    socket.on("userJoined", (data) => {
      users.push({ id: socket.id, username: data.username, avatar: data.avatar });
      io.emit("userList", users);
    });

    socket.on("message", (data) => {
      socket.broadcast.emit("message", data);
    });

    // ✅ Nouveau : envoi d'image à tous
    socket.on("image", (data) => {
      socket.broadcast.emit("image", data);
    });

    socket.on("disconnect", () => {
      const index = users.findIndex(user => user.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        io.emit("userList", users);
      }
    });
  });
};
