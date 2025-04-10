// Menu déroulant mobile "+"
document.getElementById("menuToggle").addEventListener("click", () => {
  const menu = document.getElementById("mobileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// Menu utilisateurs (mobile)
function toggleUsers() {
  const list = document.getElementById("userList");
  list.style.display = list.style.display === "none" ? "block" : "none";
}
