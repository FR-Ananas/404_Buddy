// ... Toutes les fonctions habituelles au-dessus (logout, previewImage, etc.)

window.sendImage = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  // ✅ Liste des types MIME autorisés
  const supportedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
    "image/x-icon",
    "image/tiff"
  ];

  if (!supportedTypes.includes(file.type)) {
    alert("Format non pris en charge : " + file.type);
    return;
  }

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
};
