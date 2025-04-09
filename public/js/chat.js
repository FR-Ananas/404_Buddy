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
  messages.forEach(m => addMessage(m));
});

socket.on('chat-message', (message) => {
  addMessage(message);
});

socket.on('user-joined', (user) => {
  addMessage({
    text: `🟢 ${user} a rejoint le chat`,
    system: true
  });
  addUserToList(user);
});

socket.on('user-left', (user) => {
  addMessage({
    text: `🔴 ${user} a quitté le chat`,
    system: true
  });
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

function addMessage({ user = null, text, time = null, system = false }) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('message-bubble');

  if (system) {
    div.classList.add('system');
  } else if (user === username) {
    div.classList.add('you');
  }

  if (time) {
    const timeTag = document.createElement('span');
    timeTag.classList.add('timestamp');
    timeTag.textContent = `🕒 ${time}`;
    div.appendChild(timeTag);
  }

  const content = document.createElement('div');
  content.textContent = user && !system ? `${user}: ${text}` : text;
  div.appendChild(content);

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  if (system) {
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
