const users = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Nouveau client connecté :", socket.id);

    // Quand un utilisateur rejoint avec ses infos
    socket.on("userJoined", (userData) => {
      users.set(socket.id, userData);
      console.log("👥 Utilisateur ajouté :", userData);
      io.emit("userList", Array.from(users.values()));
    });

    // Message reçu
    socket.on("message", (data) => {
      console.log("💬 Message de", data.username, ":", data.content);
      io.emit("message", data);
    });

    // Déconnexion
    socket.on("disconnect", () => {
      console.log("🔴 Client déconnecté :", socket.id);
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
    });
  });
};
