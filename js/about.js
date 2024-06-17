// Importar GSAP para fazer uso de animações
const { gsap } = window;

// Função para abrir o menu "About" com animação suave
function openAboutMenu() {
  const aboutMenu = document.querySelector(".aboutMenu");
  const aboutMenuContent = document.querySelector(".aboutMenu-content");

  aboutMenu.classList.add("open"); // Adicionar classe para abrir o menu

  gsap.fromTo(
    aboutMenuContent,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
  );
}

// Função para fechar o menu "About" com animação suave
function closeAboutMenu() {
  const aboutMenu = document.querySelector(".aboutMenu");
  const aboutMenuContent = document.querySelector(".aboutMenu-content");

  gsap.to(
    aboutMenuContent,
    { opacity: 0, y: 50, duration: 0.2, ease: "power2.in", onComplete: () => {
      aboutMenu.classList.remove("open"); // Remover classe ao fechar o menu
    }}
  );
}

// Event listener para o botão "About"
document.getElementById("aboutBtn").addEventListener("click", function() {
  openAboutMenu();
});

// Event listener para o botão de fechar o menu "About"
document.querySelector(".aboutMenu .close").addEventListener("click", function() {
  closeAboutMenu();
});

// Event listener para fechar o menu se clicar fora dele
document.addEventListener("click", function(event) {
  const aboutMenu = document.querySelector(".aboutMenu");
  if (!aboutMenu.contains(event.target) && event.target !== document.getElementById("aboutBtn")) {
    closeAboutMenu();
  }
});
