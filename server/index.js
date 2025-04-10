const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Socket manager
require('./socketManager')(io);

// Launch
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ 404Buddy actif sur http://localhost:${PORT}`);
});
