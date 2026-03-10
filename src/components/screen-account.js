import "../../assets/styles/screen-account.css";

class ScreenAccount extends HTMLElement {
  constructor() {
    super();
    this.mode = "signIn"; // controle interno de qual tela mostrar
  }

  connectedCallback() {
    this.innerHTML = `
      <section id="screen-account" class="screen" aria-label="Conta">
          <div class="account-container">

              <!-- Clerk container para Sign-In ou Profile -->
              <div id="clerk-container" style="display: flex; justify-content: center; align-items: center; width: 100%; margin: 10px auto;"></div>
              
              <!-- Container de alternância criado por nós -->
              <div id="toggle-container" style="text-align: center;"></div>

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
    let clerkContainer = this.querySelector("#clerk-container");
    const toggleContainer = this.querySelector("#toggle-container");
    if (!clerkContainer) return;

    if (window.Clerk && window.isClerkLoaded) {
      if (window.Clerk.user) {
        // Usuário logado: pode mostrar o perfil Clerk (opcional) ou uma mensagem
        clerkContainer.innerHTML = `<div style="text-align: center;">
            <h2>Olá, ${window.Clerk.user.firstName}!</h2>
            <p>Você está logado e pode acessar todas as ferramentas.</p>
        </div>`;
        if (toggleContainer) toggleContainer.innerHTML = "";
      } else {
        // Para evitar erros do React de unmount ("Failed to execute 'removeChild'"), removemos as montagens velhas
        try {
          window.Clerk.unmountSignIn(clerkContainer);
          window.Clerk.unmountSignUp(clerkContainer);
        } catch (e) {}

        // Recria o nó do DOM inteiramente como garantia
        const newContainer = document.createElement("div");
        newContainer.id = "clerk-container";
        newContainer.style.display = "flex";
        newContainer.style.justifyContent = "center";
        newContainer.style.alignItems = "center";
        newContainer.style.width = "100%";
        newContainer.style.margin = "10px auto";
        clerkContainer.parentNode.replaceChild(newContainer, clerkContainer);
        clerkContainer = newContainer;

        // Esconde ação de rodapé do clerk para não redirecionar e sumir do app
        const appearanceOpts = {
          elements: {
            footerAction: { display: "none" },
          },
        };

        if (this.mode === "signIn") {
          window.Clerk.mountSignIn(clerkContainer, {
            routing: "virtual",
            appearance: appearanceOpts,
          });

          if (toggleContainer) {
            toggleContainer.innerHTML = `
              <p style="font-size: 14px; margin-top: 10px; color: #555;">
                Não tem uma conta? 
                <button type="button" style="background:none; border:none; color:var(--primary, #2e6b45); font-weight:bold; cursor:pointer;" onclick="document.querySelector('screen-account').toggleMode()">
                  Cadastre-se
                </button>
              </p>
            `;
          }
        } else {
          window.Clerk.mountSignUp(clerkContainer, {
            routing: "virtual",
            appearance: appearanceOpts,
          });

          if (toggleContainer) {
            toggleContainer.innerHTML = `
              <p style="font-size: 14px; margin-top: 10px; color: #555;">
                Já tem uma conta? 
                <button type="button" style="background:none; border:none; color:var(--primary, #2e6b45); font-weight:bold; cursor:pointer;" onclick="document.querySelector('screen-account').toggleMode()">
                  Faça Login
                </button>
              </p>
            `;
          }
        }
      }
    } else {
      clerkContainer.innerHTML =
        '<p style="text-align: center;">Carregando autenticação...</p>';
    }
  }

  toggleMode() {
    this.mode = this.mode === "signIn" ? "signUp" : "signIn";
    this.loadAuth();
  }

  updateData() {}
}

customElements.define("screen-account", ScreenAccount);
