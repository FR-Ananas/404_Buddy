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
  messages.forEach(m => addMessage(`${m.user}: ${m.text}`, { user: m.user }));
});

socket.on('chat-message', ({ user, text }) => {
  addMessage(`${user}: ${text}`, { user: user });
});

socket.on('user-joined', (user) => {
  addMessage(`🟢 ${user} a rejoint le chat`, { system: true });
  addUserToList(user);
});

socket.on('user-left', (user) => {
  addMessage(`🔴 ${user} a quitté le chat`, { system: true });
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

function addMessage(msg, options = {}) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('message-bubble');

  // Appliquer un style différent pour les messages système ou pour l'utilisateur actuel
  if (options.system) {
    div.classList.add('system');
  } else if (options.user && options.user === username) {
    div.classList.add('you');
  }

  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  // Les messages système disparaissent après 10 secondes
  if (options.system) {
    setTimeout(() => {
      div.remove();
    }, 10000);
  }
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
