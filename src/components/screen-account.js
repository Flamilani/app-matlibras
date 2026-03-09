import "../../assets/styles/screen-account.css";

class ScreenAccount extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="screen-account" class="screen" aria-label="Conta">
          <div class="account-container">
              <div class="logo-container">
                  <img src="./assets/imgs/logo-matlibras.jpeg" alt="Logo MatiLibras" class="logo-img" />
              </div>

              <!-- Clerk container para Sign-In ou Profile -->
              <div id="clerk-container" style="display: flex; justify-content: center; align-items: center; width: 100%; margin: 20px auto;"></div>

          </div>
      </section>
    `;
    this.loadAuth();

    // Adiciona listener para quando o Clerk carregar
    window.addEventListener("clerk-loaded", () => {
      this.loadAuth();
    });
  }

  loadAuth() {
    const clerkContainer = this.querySelector("#clerk-container");
    if (!clerkContainer) return;

    if (window.Clerk && window.isClerkLoaded) {
      if (window.Clerk.user) {
        // Usuário logado: pode mostrar o perfil Clerk (opcional) ou uma mensagem
        clerkContainer.innerHTML = `<div style="text-align: center;">
            <h2>Olá, ${window.Clerk.user.firstName}!</h2>
            <p>Você está logado e pode acessar todas as ferramentas.</p>
        </div>`;
      } else {
        // Limpa o texto "Carregando" antes de montar o Sign In
        clerkContainer.innerHTML = "";
        // Usuário não logado: monta o componente de Sign In
        window.Clerk.mountSignIn(clerkContainer);
      }
    } else {
      clerkContainer.innerHTML =
        '<p style="text-align: center;">Carregando autenticação...</p>';
    }
  }

  updateData() {}
}

customElements.define("screen-account", ScreenAccount);
