const users = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connecté :", socket.id);

    socket.on("userJoined", (userData) => {
      users.set(socket.id, userData);
      console.log("👥 Connecté :", userData.username);
      io.emit("userList", Array.from(users.values()));
    });

    socket.on("message", (data) => {
      console.log("💬 Message de", data.username, ":", data.content);
      io.emit("message", data); // ✅ tous les utilisateurs reçoivent
    });

    socket.on("image", (data) => {
      console.log("🖼️ Image reçue de", data.username);
      io.emit("image", data); // ✅ tous les utilisateurs reçoivent
    });

    socket.on("disconnect", () => {
      console.log("🔴 Déconnecté :", socket.id);
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
    });
  });
};
