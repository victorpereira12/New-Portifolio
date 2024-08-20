function menuMobile() {
  let mobileMenu = document.querySelector(".navbar-mobile");
  if (mobileMenu.classList.contains("open")) {
    mobileMenu.classList.remove("open");
    document.querySelector(".menu-icon").src =
      "./assets/icons8-cardápio-50.png";
  } else {
    mobileMenu.classList.add("open");
    document.querySelector(".menu-icon").src = "./assets/icons8-excluir-50.png";
  }
}
