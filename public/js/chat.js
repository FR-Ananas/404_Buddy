const socket = io();
const username = localStorage.getItem('username');

if (!username) window.location.href = 'login.html';

socket.emit('login', username, (response) => {
  if (!response.success) {
    alert(response.message);
    window.location.href = 'login.html';
  }
});

socket.on('init', ({ users, messages }) => {
  users.forEach(addUserToList);
  messages.forEach(m => addMessage(`${m.user}: ${m.text}`));
});

socket.on('chat-message', ({ user, text }) => {
  addMessage(`${user}: ${text}`);
});

socket.on('user-joined', (user) => {
  addMessage(`🟢 ${user} a rejoint le chat`);
  addUserToList(user);
});

socket.on('user-left', (user) => {
  addMessage(`🔴 ${user} a quitté le chat`);
  removeUserFromList(user);
});

socket.on('update-users', (userList) => {
  updateUserList(userList);
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

function addUserToList(user) {
  const userList = document.getElementById('user-list');
  const li = document.createElement('li');
  li.id = `user-${user}`;
  li.textContent = user;
  userList.appendChild(li);
}

function removeUserFromList(user) {
  const el = document.getElementById(`user-${user}`);
  if (el) el.remove();
}

function updateUserList(users) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';
  users.forEach(addUserToList);
}

function toggleUsers() {
  const box = document.getElementById('users-box');
  box.classList.toggle('visible');
}
