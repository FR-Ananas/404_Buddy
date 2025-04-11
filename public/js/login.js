document.getElementById('loginPic').addEventListener('change', function () {
  const label = document.getElementById('fileLabelText');
  if (this.files.length > 0) {
    label.textContent = "Image sélectionnée : " + this.files[0].name;
  } else {
    label.textContent = "Aucune image sélectionnée";
  }
});

function login() {
  const name = document.getElementById('loginName').value;
  const file = document.getElementById('loginPic').files[0];
  if (!name || !file) {
    alert("Entre un pseudo ET une image !");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    sessionStorage.setItem("avatar", e.target.result);
    sessionStorage.setItem("username", name);
    document.getElementById('xpLoaderPopup').style.display = 'flex';

    setTimeout(() => {
      window.location.href = "chat.html";
    }, 2600);
  };
  reader.readAsDataURL(file);
}
