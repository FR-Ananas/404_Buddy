const socket = io();

const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const pseudo = localStorage.getItem("pseudo") || "Inconnu";
const avatarSrc = localStorage.getItem("avatar") || "";

// Set pseudo et avatar à l'écran
document.getElementById("userName").innerText = pseudo;
document.getElementById("userPic").src = avatarSrc;

// Envoi d'un message
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  if (text.startsWith("/") || text.toLowerCase().startsWith(">//")) {
    handleCommand(text);
    input.value = "";
    return;
  }

  socket.emit("message", {
    user: pseudo,
    text: text,
    avatar: avatarSrc
  });

  input.value = "";
}

// Réception de message
socket.on("message", ({ user, text, avatar }) => {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<img src="${avatar}" class="avatar"><strong>${user}:</strong> ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Update du nombre d'utilisateurs
socket.on("update-users", (count) => {
  const userCount = document.getElementById("userCount");
  if (userCount) userCount.innerText = `${count} / 100`;
});

socket.emit("user-joined", pseudo);

// Commandes spéciales
function handleCommand(cmd) {
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.innerHTML = `<img src="${avatarSrc}" class="avatar"><strong>404Buddy:</strong> `;

  if (cmd === "/ping") {
    div.innerHTML += "pong.";
  } else if (cmd === "/error") {
    div.innerHTML += "<span style='color:red;'>ERREUR FATALE : cerveau non détecté</span>";
  } else if (cmd === ">//no") {
    div.innerHTML += `<pre style="font-family: monospace; font-size: 12px; color: #0f0; background: #000; padding: 10px; border: 1px solid #0f0;">[ ACCESSING SYSTEM CORE... ]
███╗   ██╗ ██████╗ ██████╗ ██╗   ██╗
████╗  ██║██╔═══██╗██╔══██╗╚██╗ ██╔╝
██╔██╗ ██║██║   ██║██████╔╝ ╚████╔╝ 
██║╚██╗██║██║   ██║██╔═══╝   ╚██╔╝  
██║ ╚████║╚██████╔╝██║        ██║   
╚═╝  ╚═══╝ ╚═════╝ ╚═╝        ╚═╝   
> SYSTEM OVERRIDE : INITIATING HACK SEQUENCE...
> PLEASE DO NOT LOOK BEHIND YOU.</pre>`;
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
      socket.emit("message", {
        user: pseudo,
        text: `<br><img src="${e.target.result}" class="shared-img" onclick="previewImage(this.src)">`,
        avatar: avatarSrc
      });
    };
    reader.readAsDataURL(file);
  }
}

// Aperçu image
function previewImage(src) {
  document.getElementById("previewImg").src = src;
  document.getElementById("imagePreview").style.display = "flex";
}

// Popup & pseudo
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
