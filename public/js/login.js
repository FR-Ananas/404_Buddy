document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector("button[onclick='login()']");
  const nameInput = document.getElementById("loginName");
  const picInput = document.getElementById("loginPic");
  const fileLabel = document.getElementById("fileLabelText");

  // Affiche le nom de l'image sélectionnée
  picInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      fileLabel.textContent = "Image sélectionnée : " + this.files[0].name;
    } else {
      fileLabel.textContent = "Aucune image sélectionnée";
    }
  });

  // Fonction de connexion
  window.login = function () {
    const name = nameInput.value;
    const file = picInput.files[0];

    if (!name || !file) {
      alert("Entre un pseudo ET une image !");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      sessionStorage.setItem("username", name);
      sessionStorage.setItem("avatar", e.target.result);
      window.location.href = "/"; // redirige vers chat.html
    };
    reader.readAsDataURL(file);
  };
});
