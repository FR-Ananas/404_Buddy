document.getElementById('loginPic').addEventListener('change', function () {
  const label = document.getElementById('fileLabelText');
  if (this.files.length > 0) {
    label.textContent = "Image sélectionnée : " + this.files[0].name;
  } else {
    label.textContent = "Aucune image sélectionnée";
  }
});

function login() {
  const name = document.getElementById('loginName').value.trim();
  const file = document.getElementById('loginPic').files[0];

  if (!name) {
    alert("Entre un pseudo !");
    return;
  }

  // ✅ Si aucune image → avatar par défaut
  if (!file) {
    sessionStorage.setItem("username", name);
    sessionStorage.setItem("avatar", "/img/noPictures.png");

    document.getElementById('xpLoaderPopup').style.display = 'flex';

    setTimeout(() => {
      window.location.href = "/chat.html";
    }, 2600);
    return;
  }

  // ✅ On attend que le fichier soit lu avant redirection
  const reader = new FileReader();
  reader.onload = function (e) {
    sessionStorage.setItem("username", name);
    sessionStorage.setItem("avatar", e.target.result);  // base64

    // Afficher un loader ou animation pendant le delay
    document.getElementById('xpLoaderPopup').style.display = 'flex';

    setTimeout(() => {
      window.location.href = "/chat.html";
    }, 2600);
  };
  reader.readAsDataURL(file);
}
