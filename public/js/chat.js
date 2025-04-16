if (!sessionStorage.getItem("username") || !sessionStorage.getItem("avatar")) {
  window.location.href = "/login.html";
}

window.logout = function () {
  sessionStorage.clear();
  window.location.href = "/login.html";
};

window.toggleTheme = function () {
  document.body.classList.toggle("dark-mode");
};

window.toggleFileMenu = function () {
  document.getElementById("fileMenu").classList.toggle("show");
};

window.triggerImageUpload = function () {
  document.getElementById("fileInput").click();
  document.getElementById("fileMenu").classList.remove("show");
};

let pendingLink = null;

function showLinkPopup(url) {
  pendingLink = url;
  document.getElementById("linkWarningText").innerText = `Souhaites-tu vraiment ouvrir ce lien ?\n${url}`;
  document.getElementById("linkPopup").style.display = "block";
}

function closeLinkPopup() {
  pendingLink = null;
  document.getElementById("linkPopup").style.display = "none";
}

function proceedToLink() {
  if (pendingLink) {
    window.open(pendingLink, "_blank");
  }
  closeLinkPopup();
}

function parseMessageWithLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return `<a href="#" onclick="showLinkPopup('${url}')">${url}</a>`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const socket = io({ transports: ["websocket"] });

  const avatarSrc = sessionStorage.getItem("avatar");
  const username = sessionStorage.getItem("username");

  socket.emit("userJoined", { username, avatar: avatarSrc });

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
      username,
      avatar: avatarSrc,
      content: msg
    });

    input.value = '';
  }

  socket.on("message", function(data) {
    const div = document.createElement("div");
    div.className = "chat-msg";
    div.innerHTML = `
      <img src="${data.avatar}" class="avatar">
      <div class="msg-text">
        <strong>${data.username}:</strong> ${parseMessageWithLinks(data.content)}
      </div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  });

  socket.on("image", function(data) {
    const div = document.createElement("div");
    div.className = "chat-msg";
    div.innerHTML = `
      <img src="${data.avatar}" class="avatar">
      <div class="msg-text">
        <strong>${data.username}:</strong><br>
        <img src="${data.image}" class="shared-img" onclick="previewImage(this.src)">
      </div>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  });

  socket.on("userList", function(users) {
    const sidebar = document.querySelector(".sidebar");
    const userCount = document.getElementById("userCount");

    userCount.innerText = `${users.length} / 100`;

    const userListHTML = users.map(user => `
      <div class="user">
        <img src="${user.avatar}" />
        <span>${user.username}</span>
      </div>
    `).join("");

    sidebar.innerHTML = `
      <h3>Connectés</h3>
      <div style="font-size: 11px; color: #666; margin-bottom: 8px;" id="userCount">${users.length} / 100</div>
      ${userListHTML}
    `;
  });

  socket.on("history", function (messages) {
    messages.forEach((data) => {
      const div = document.createElement("div");
      div.className = "chat-msg";

      if (data.type === "text") {
        div.innerHTML = `
          <img src="${data.avatar}" class="avatar">
          <div class="msg-text">
            <strong>${data.username}:</strong> ${parseMessageWithLinks(data.content)}
          </div>
        `;
      } else if (data.type === "image") {
        div.innerHTML = `
          <img src="${data.avatar}" class="avatar">
          <div class="msg-text">
            <strong>${data.username}:</strong><br>
            <img src="${data.image}" class="shared-img" onclick="previewImage(this.src)">
          </div>
        `;
      }

      chat.appendChild(div);
    });

    chat.scrollTop = chat.scrollHeight;
  });

  function handleCommand(cmd) {
    const command = cmd.toLowerCase();
    const response = document.createElement('div');
    response.className = "chat-msg";
    response.innerHTML = `<img src="${avatarSrc}" class="avatar">
    <div class="msg-text"><strong>404Buddy:</strong> `;

    if (command === "/joke") {
      response.innerHTML += "Pourquoi les pirates aiment l'hiver ? Parce qu'ils gèlent tous les ports.";
    } else if (command === "/ping") {
      response.innerHTML += "pong.";
    } else if (command === "/error") {
      response.innerHTML += "<span style='color:red;'>ERREUR FATALE : cerveau non détecté</span>";
    } else {
      response.innerHTML += "Commande inconnue : " + cmd;
    }

    response.innerHTML += "</div>";
    chat.appendChild(response);
    chat.scrollTop = chat.scrollHeight;
  }

  window.sendImage = function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = e.target.result;
        socket.emit("image", {
          username,
          avatar: avatarSrc,
          image: imageData
        });
      };
      reader.readAsDataURL(file);
    }
  };

  window.previewImage = function(src) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = src;
    preview.style.display = 'flex';
  };
});
