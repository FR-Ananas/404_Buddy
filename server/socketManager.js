module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🔌 Nouvel utilisateur connecté");

    socket.on("message", (data) => {
      console.log("📨 Message reçu :", data);
      io.emit("message", data); // Diffuse à tous les utilisateurs
    });

    socket.on("disconnect", () => {
      console.log("👋 Utilisateur déconnecté");
    });
  });
};
