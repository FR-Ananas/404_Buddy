document.addEventListener("DOMContentLoaded", function () {
  const socket = io();

  const avatarSrc = sessionStorage.getItem("avatar") || "";
  const username = sessionStorage.getItem("username") || "YOU";

  const userPic = document.getElementById('userPic');
  const userName = document.getElementById('userName');
  const pseudo = document.getElementById('pseudo');
  const avatarChat = document.getElementById('chatAvatar');

  if (userPic) userPic.src = avatarSrc;
  if (userName) userName.innerText = username;
  if (pseudo) pseudo.innerText = username + ":";
  if (avatarChat) avatarChat.src = avatarSrc;

  const sendBtn = document.getElementById('sendBtn');
  const input = document.getElementById('msgInput');
  const chat = document.getElementById('chat');

  sendBtn.addEventListener("click", () => sendMessage(input.value));
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  function sendMessage(msg) {
    msg = msg.trim();
    if (!msg) return;

    if (msg.startsWith('/') || msg.toLowerCase().startsWith('>//')) {
      handleCommand(msg);
      input.value = '';
      return;
    }

    socket.emit("message", {
      username: username,
      avatar: avatarSrc,
      content: msg
    });

    input.value = '';
  }

  socket.on("message", function(data) {
    const div = document.createElement("div");
    div.className = "chat-msg";
    div.innerHTML = "<img src='" + data.avatar + "' class='avatar'><strong>" + data.username + ":</strong> " + data.content;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  });

  function handleCommand(cmd) {
    const command = cmd.toLowerCase();
    const response = document.createElement('div');
    response.className = "chat-msg";
    response.innerHTML = "<img src='" + avatarSrc + "' class='avatar'><strong>404Buddy:</strong> ";

    if (command === "/joke") {
      response.innerHTML += "Pourquoi les pirates aiment l'hiver ? Parce qu'ils gèlent tous les ports.";
    } else if (command === "/ping") {
      response.innerHTML += "pong.";
    } else if (command === "/error") {
      response.innerHTML += "<span style='color:red;'>ERREUR FATALE : cerveau non détecté</span>";
    } else {
      response.innerHTML += "Commande inconnue : " + cmd;
    }

    chat.appendChild(response);
    chat.scrollTop = chat.scrollHeight;
  }

  function sendImage(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const div = document.createElement('div');
        div.className = "chat-msg";
        div.innerHTML = "<img src='" + avatarSrc + "' class='avatar'><strong>" + username + ":</strong><br><img src='" + e.target.result + "' class='shared-img' onclick='previewImage(this.src)'>";
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
      };
      reader.readAsDataURL(file);
    }
  }

  function previewImage(src) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = src;
    preview.style.display = 'flex';
  }
});
