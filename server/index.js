const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Appel du gestionnaire socket
require("./socketManager")(io);

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
});
