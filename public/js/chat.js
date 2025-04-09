const socket = io();
const username = localStorage.getItem('username');

socket.emit('login', username);

socket.on('chat-message', ({ user, text }) => {
  addMessage(`${user}: ${text}`);
});

socket.on('user-joined', (user) => {
  addMessage(`🟢 ${user} a rejoint le chat`);
});

socket.on('user-left', (user) => {
  addMessage(`🔴 ${user} a quitté le chat`);
});

function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value;
  if (message.trim()) {
    socket.emit('chat-message', message);
    input.value = '';
  }
}

function addMessage(msg) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
