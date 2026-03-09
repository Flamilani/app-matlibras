import { ptBR } from "@clerk/localizations";

window.addEventListener("load", async function () {
  // 1. Inicializa o Clerk
  await window.Clerk.load({
    localization: ptBR,
    appearance: {
      variables: {
        colorPrimary: "hsl(157, 98%, 16%)",
      },
    },
  });
  window.isClerkLoaded = true;

  const appContent = document.getElementById("app-content");
  const userButtonDiv = document.getElementById("user-button");

  // Remove the old app-content skeleton loading text since the screens handle the UI
  if (appContent) {
    appContent.style.display = "none";
  }

  // 2. Verifica se existe um usuário logado
  if (window.Clerk.user) {
    // Renderiza o botão de perfil/logout no header
    window.Clerk.mountUserButton(userButtonDiv, {
      afterSignOutUrl: window.location.href,
    });
  } else {
    // Se não está logado e estava em alguma rota protegida, manda para 'account'
    const protectedRoutes = ["search", "dict", "libras"];
    if (
      typeof state !== "undefined" &&
      protectedRoutes.includes(state.activeRoute)
    ) {
      showScreen("account");
    }
  }

  // Emite evento para os componentes que dependem do Clerk atualizarem
  window.dispatchEvent(new Event("clerk-loaded"));
});
