const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Redirection automatique vers login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Statics
app.use(express.static(path.join(__dirname, "../public")));

// Socket manager
require("./socketManager")(io);

// Lancement
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("✅ Serveur lancé sur le port", PORT);
});
