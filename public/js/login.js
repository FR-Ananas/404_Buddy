document.getElementById('loginPic').addEventListener('change', function () {
  const label = document.getElementById('fileLabelText');
  label.textContent = this.files.length ? "Image sélectionnée : " + this.files[0].name : "Aucune image sélectionnée";
});

function start() {
  const name = document.getElementById('loginName').value;
  const file = document.getElementById('loginPic').files[0];
  if (!name || !file) {
    alert("Entre un pseudo ET une image !");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    localStorage.setItem("pseudo", name);
    localStorage.setItem("avatar", e.target.result);
    window.location.href = "/chat.html";
  };
  reader.readAsDataURL(file);
}
