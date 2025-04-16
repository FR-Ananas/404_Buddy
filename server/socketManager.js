const users = new Map();
const messageHistory = []; // 🔁 stockage des derniers messages

const MAX_HISTORY = 50;

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connecté :", socket.id);

    // ✅ Envoyer l'historique des messages dès la connexion
    socket.emit("history", messageHistory);

    socket.on("userJoined", (userData) => {
      users.set(socket.id, userData);
      console.log("👥 Connecté :", userData.username);
      io.emit("userList", Array.from(users.values()));
    });

    socket.on("message", (data) => {
      console.log("💬 Message de", data.username, ":", data.content);

      // ✅ Ajouter au tableau d'historique (et garder max 50)
      messageHistory.push({ type: "text", ...data });
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift(); // Supprime le plus ancien
      }

      io.emit("message", data);
    });

    socket.on("image", (data) => {
      console.log("🖼️ Image reçue de", data.username);

      // ✅ Ajouter au tableau d'historique
      messageHistory.push({ type: "image", ...data });
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory.shift();
      }

      io.emit("image", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Déconnecté :", socket.id);
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
    });
  });
};
