const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO handler
require("./socketManager")(io);

// Serve public/
app.use(express.static(path.join(__dirname, "../public")));

// Redirige vers chat.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
