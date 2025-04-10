const socket = io();

const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const pseudo = localStorage.getItem("pseudo") || "Inconnu";
const avatarSrc = localStorage.getItem("avatar") || "";

// Affiche pseudo et avatar dans la sidebar
document.getElementById("userName").innerText = pseudo;
document.getElementById("userPic").src = avatarSrc;

// Envoie l'identité à la connexion
socket.emit("user-joined", {
  pseudo: pseudo,
  avatar: avatarSrc
});

// Envoi d’un message
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  if (text.startsWith("/") || text.toLowerCase().startsWith(">//")) {
    handleCommand(text);
    input.value = "";
    return;
  }

  socket.emit("chat-message", text);
  input.value = "";
}

// Réception de message
socket.on("chat-message", ({ user, text, avatar }) => {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<img src="${avatar}" class="avatar"><strong>${user}:</strong> ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("update-users", (users) => {
  document.getElementById("userCount").innerText = `${users.length} / 100`;
});

// Commandes spéciales
function handleCommand(cmd) {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<img src="${avatarSrc}" class="avatar"><strong>404Buddy:</strong> `;

  if (cmd === ">//no") {
    div.innerHTML += `<pre style="font-family: monospace; font-size: 12px; color: #0f0; background: #000; padding: 10px; border: 1px solid #0f0;">[ SYSTEM OVERRIDE ] HACK INCOMING...</pre>`;
  } else {
    div.innerHTML += `Commande inconnue : ${cmd}`;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Envoi d’image
function sendImage(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      socket.emit("chat-message", `<br><img src="${e.target.result}" class="shared-img" onclick="previewImage(this.src)">`);
    };
    reader.readAsDataURL(file);
  }
}

function previewImage(src) {
  document.getElementById("previewImg").src = src;
  document.getElementById("imagePreview").style.display = "flex";
}

function togglePopup(id) {
  const popup = document.getElementById(id);
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function changeUsername() {
  const newName = prompt("Ton nouveau pseudo :");
  if (newName) {
    localStorage.setItem("pseudo", newName);
    location.reload();
  }
}

// Menus mobiles
document.getElementById("toggleMenu").addEventListener("click", () => {
  const menu = document.getElementById("mobileNavPopup");
  menu.classList.toggle("show");
});

document.getElementById("toggleUsers").addEventListener("click", () => {
  const popup = document.getElementById("userPopup");
  popup.classList.toggle("show");
});
