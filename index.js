const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const setupSocket = require('./socketManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => res.redirect('/login.html'));

setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));