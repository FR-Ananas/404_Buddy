const users = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("🟢 Nouveau client connecté :", socket.id);

    // 🔁 Envoie l'historique à la connexion (si tu stockes un historique)
    socket.emit("history", global.messageHistory || []);

    // 🧍 Quand un nouvel utilisateur se connecte
    socket.on("userJoined", (userData) => {
      console.log("👥 Connexion de :", userData.username);

      // 🔄 Vérifie si un autre socket utilise déjà ce pseudo
      const existingEntry = [...users.entries()].find(([id, u]) => u.username === userData.username);

      // 🔧 Supprime l'ancienne entrée avec le même pseudo
      if (existingEntry) {
        users.delete(existingEntry[0]);
      }

      users.set(socket.id, userData);
      io.emit("userList", Array.from(users.values()));
    });

    // 💬 Message texte
    socket.on("message", (data) => {
      console.log("💬", data.username, ":", data.content);

      // 🔒 Stocker dans l'historique global (50 derniers)
      if (!global.messageHistory) global.messageHistory = [];
      global.messageHistory.push({ type: "text", ...data });
      if (global.messageHistory.length > 50) global.messageHistory.shift();

      io.emit("message", data);
    });

    // 🖼️ Image
    socket.on("image", (data) => {
      console.log("🖼️ Image de", data.username);

      if (!global.messageHistory) global.messageHistory = [];
      global.messageHistory.push({ type: "image", ...data });
      if (global.messageHistory.length > 50) global.messageHistory.shift();

      io.emit("image", data);
    });

    // ❌ Déconnexion
    socket.on("disconnect", () => {
      console.log("🔴 Déconnecté :", socket.id);
      users.delete(socket.id);
      io.emit("userList", Array.from(users.values()));
    });
  });
};
