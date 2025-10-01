const modal = document.getElementById("terminalModal");
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");
const openButton = document.getElementById("openBtn");
const buttonclose = document.getElementById("closeBtn");
const container = document.querySelector(".container");
const blockOverlay = document.getElementById("blockOverlay");
const blockOk = document.getElementById("blockOk");
const caverna = document.getElementById("caverna");
const menuToggle = document.querySelector(".menu-toggle");

const navUl = document.querySelector("nav > ul");
let typewriterTimeoutId; // variável global para guardar o ID do timeout
let autoCloseTimeoutId; // guardamos o timeout do fechamento automático
function typeWriterEffect(text, callback, speed = 30) {
  let i = 0;

  function type() {
    if (i < text.length) {
      output.innerHTML += text.charAt(i);
      i++;
      typewriterTimeoutId = setTimeout(type, speed); // guarda o ID
      output.scrollTop = output.scrollHeight; // auto-scroll
    } else if (callback) {
      callback();
    }
  }

  type();
}

function openTerminal() {
  openButton.disabled = true; // desativa ao abrir
  modal.style.display = "flex";
  output.innerHTML = "";
  input.value = "";
  input.disabled = true;

  const intro = [
    "Bem-vindo à demo de Chronicles of an Adventurer.\n",
    "Você e seu amigo chegaram diante de uma caverna sombria...\n",
    "Dizem que ali repousa o lendário Coração do Rei Dragão.\n",
    "O que deseja fazer?\n",
    "1 - Entrar\n",
    "2 - Fugir\n",
  ].join("");

  typeWriterEffect(intro, () => {
    input.disabled = false;
    input.focus();
  });
}

function closeTerminal() {
  if (!modal) return;

  modal.classList.add("hide"); // fade-out
  setTimeout(() => {
    modal.style.display = "none"; // esconde, mas mantém no DOM
    modal.classList.remove("hide"); // reseta classe p/ próxima vez
  }, 1000);

  if (openButton) openButton.disabled = false;
  container.classList.remove("expandido");
  modal.classList.remove("ativa");
  caverna.pause();
  if (typewriterTimeoutId) clearTimeout(typewriterTimeoutId);
  if (autoCloseTimeoutId) clearTimeout(autoCloseTimeoutId);
}

openButton.addEventListener("click", () => {
  container.classList.add("expandido");
  modal.classList.add("ativa");
  caverna.currentTime = 0;
  caverna.play();
});

// intercepta tentativa de fechar
buttonclose.addEventListener("click", () => {
  blockOverlay.style.display = "flex"; // mostra aviso
});

// botão de OK apenas fecha o aviso
blockOk.addEventListener("click", () => {
  blockOverlay.style.display = "none";
}); // Lógica de comandos
let etapa = "inicio";
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const value = input.value.trim().toLowerCase();
    input.value = "";
    input.disabled = true;

    // ETAPA INICIAL
    if (etapa === "inicio") {
      if (value === "1") {
        typeWriterEffect(
          "\n\nVocê entra na caverna... e um monstro aparece!\n",
          () => {
            typeWriterEffect(
              "Gostou?\nBaixe a versão Beta e continue sua aventura em Windows / Linux / Mac.\nDeseja fechar o terminal? [s/n] (fechará automaticamente em 5s)",
              () => {
                etapa = "fechar-ou-reiniciar"; // muda de fase
                input.disabled = false;
                input.focus();

                autoCloseTimeoutId = setTimeout(closeTerminal, 5000);
              }
            );
          }
        );
      } else if (value === "2") {
        typeWriterEffect(
          "\nVocê foge em segurança, mas a aventura termina.\n",
          () => {
            typeWriterEffect(
              "Gostou?\nBaixe a versão Beta e continue sua aventura em Windows / Linux / Mac.\nDeseja fechar o terminal? [s/n] (fechará automaticamente em 5s)",
              () => {
                etapa = "fechar-ou-reiniciar"; // muda de fase
                input.disabled = false;
                input.focus();

                autoCloseTimeoutId = setTimeout(closeTerminal, 5000);
              }
            );
          }
        );
      } else {
        typeWriterEffect("\nComando inválido.\n", () => {
          input.disabled = false;
          input.focus();
        });
      }
    } else if (etapa === "fechar-ou-reiniciar") {
      if (value === "s") {
        typeWriterEffect("\nEncerrando o terminal...\n", () => {
          closeTerminal();
        });
      } else if (value === "n") {
        typeWriterEffect("\nReiniciando terminal...\n", () => {
          etapa = "inicio"; // volta para o início
          clearTimeout(autoCloseTimeoutId);
          openTerminal(); // reabre terminal com introdução
        });
      } else {
        typeWriterEffect("\nComando inválido.\n", () => {
          input.disabled = false;
          input.focus();
        });
      }
    }
  }
});

document.getElementById("copyEmailBtn").addEventListener("click", function () {
  const email = "israelvilela06@gmail.com"; // O e-mail a ser copiado

  navigator.clipboard
    .writeText(email)
    .then(function () {
      // Torna o contêiner de confirmação visível
      const alertContainer = document.getElementById("alert-email");
      const feedback = document.getElementById("feedback");

      alertContainer.style.display = "flex"; // Exibe a mensagem centralizada
      feedback.textContent = "E-mail copiado para a área de transferência!"; // Define o texto

      // Após 3 segundos, esconde o feedback
      setTimeout(function () {
        alertContainer.style.display = "none";
      }, 2000);
    })
    .catch(function (err) {
      // Caso haja um erro ao copiar
      console.error("Erro ao copiar o e-mail: ", err);
    });
});

function checkMenu() {
  if (window.innerWidth > 767) {
    navUl.classList.add("show"); // abre o menu automaticamente
  } else {
    navUl.classList.remove("show"); // fecha o menu para telas menores
  }
}

// Roda no carregamento da página
document.addEventListener("DOMContentLoaded", () => {
  checkMenu(); // garante que o menu esteja correto ao carregar
  const highlightDownload = () => {
    const platform = (navigator.platform || navigator.userAgent).toLowerCase();

    if (platform.includes("win")) {
      document.getElementById("btn-windows")?.classList.add("highlight");
    } else if (platform.includes("mac")) {
      document.getElementById("btn-macos")?.classList.add("highlight");
    } else if (platform.includes("linux")) {
      document.getElementById("btn-linux")?.classList.add("highlight");
    }
  };
  highlightDownload();
  // ---- Parte 2: Animação do nav ----
  const nav = document.querySelector("nav > ul");
  const items = document.querySelectorAll("nav > ul li a");
  let anim = null;
  let currentActiveItem = null;

  menuToggle.addEventListener("click", () => {
    navUl.classList.toggle("show");

    // Reposiciona o indicador se tiver item ativo
    if (currentActiveItem) {
      setTimeout(() => {
        moveToItem(currentActiveItem);
      }, 100);
    }
  });

  const animate = (from, to) => {
    if (anim) clearInterval(anim);

    const start = Date.now();
    anim = setInterval(() => {
      const p = Math.min((Date.now() - start) / 500, 1);
      const e = 1 - Math.pow(1 - p, 3);

      const x = from + (to - from) * e;
      const y = -40 * (4 * e * (1 - e));
      const r = 200 * Math.sin(p * Math.PI);

      nav.style.setProperty("--translate-x", `${x}px`);
      nav.style.setProperty("--translate-y", `${y}px`);
      nav.style.setProperty("--rotate-x", `${r}deg`);

      if (p >= 1) {
        clearInterval(anim);
        anim = null;
        nav.style.setProperty("--translate-y", "0px");
        nav.style.setProperty("--rotate-x", "0deg");
      }
    }, 16);
  };

  const getCurrentPosition = () =>
    parseFloat(nav.style.getPropertyValue("--translate-x")) || 0;

  const getItemCenter = (item) => {
    return (
      item.getBoundingClientRect().left +
      item.offsetWidth / 2 -
      nav.getBoundingClientRect().left -
      5
    );
  };

  const moveToItem = (item) => {
    const current = getCurrentPosition();
    const center = getItemCenter(item);
    animate(current, center);
    nav.classList.add("show-indicator");
  };

  const setActiveItem = (item) => {
    if (currentActiveItem) {
      currentActiveItem.classList.remove("active");
    }

    currentActiveItem = item;
    item.classList.add("active");
    moveToItem(item);
  };

  const handleMouseLeave = () => {
    if (currentActiveItem) {
      moveToItem(currentActiveItem);
    } else {
      nav.classList.remove("show-indicator");
      if (anim) clearInterval(anim);
    }
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => moveToItem(item));
    item.addEventListener("mouseleave", handleMouseLeave);
    item.addEventListener("click", () => setActiveItem(item));
  });

  nav.addEventListener("mouseleave", handleMouseLeave);

  if (items.length > 0) {
    setTimeout(() => {
      setActiveItem(items[0]);
    }, 100);
  }
});
window.addEventListener("resize", checkMenu);
