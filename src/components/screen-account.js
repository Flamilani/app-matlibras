class ScreenAccount extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./assets/styles/screen-account.css" />
      <section id="screen-account" class="screen" aria-label="Conta">
          <div class="account-container">
              <form id="loginForm" class="form" autocomplete="off">
                  <div class="input-group">
                      <label class="label" for="email">E-mail</label>
                      <input id="email" class="input" type="email" placeholder="exemplo@gmail.com" required />
                  </div>

                  <div class="input-group">
                      <label class="label" for="password">Senha</label>
                      <div class="password-wrapper">
                          <input id="password" class="input password-input" type="password" placeholder="Senha" required />
                          <button type="button" class="toggle-password" aria-label="Mostrar senha">
                              <svg class="eye-off" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                  <line x1="1" y1="1" x2="23" y2="23"></line>
                              </svg>
                              <svg class="eye-on" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                          </button>
                      </div>
                  </div>

                  <div class="form-options">
                      <label class="checkbox-label">
                          <input type="checkbox" id="rememberMe" class="checkbox-input" />
                          Lembrar-me
                      </label>
                      <a href="#" class="forgot-password">Esqueceu a senha?</a>
                  </div>

                  <button class="btn btn-login" type="submit">Entrar</button>
              </form>

              <div id="accountBox" class="account-box is-hidden">
                  <p class="account-box__text">
                   Logado como: <strong id="userEmail"></strong>
                  </p>
                  <button id="logoutBtn" class="btn btn--secondary" type="button">Sair</button>
              </div>
          </div>
      </section>
    `;
    this.setupAuth();
    this.loadAuth();
  }

  setupAuth() {
    const loginForm = this.querySelector("#loginForm");
    const logoutBtn = this.querySelector("#logoutBtn");
    const togglePasswordBtn = this.querySelector(".toggle-password");
    const passwordInput = this.querySelector("#password");

    if (togglePasswordBtn && passwordInput) {
      togglePasswordBtn.addEventListener("click", () => {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);

        const eyeOff = this.querySelector(".eye-off");
        const eyeOn = this.querySelector(".eye-on");

        if (type === "text") {
          eyeOff.style.display = "none";
          eyeOn.style.display = "block";
        } else {
          eyeOff.style.display = "block";
          eyeOn.style.display = "none";
        }
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = this.querySelector("#email").value.trim();
        const pass = this.querySelector("#password").value; // (protótipo)
        if (!email || !pass) return;

        localStorage.setItem("auth_email", email);
        this.loadAuth();
        alert("Login salvo (protótipo).");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("auth_email");
        this.loadAuth();
      });
    }
  }

  loadAuth() {
    const email = localStorage.getItem("auth_email");
    const loginForm = this.querySelector("#loginForm");
    const accountBox = this.querySelector("#accountBox");
    const userEmail = this.querySelector("#userEmail");

    if (!loginForm || !accountBox || !userEmail) return;

    if (email) {
      loginForm.classList.add("is-hidden");
      accountBox.classList.remove("is-hidden");
      userEmail.textContent = email;
    } else {
      loginForm.classList.remove("is-hidden");
      accountBox.classList.add("is-hidden");
      userEmail.textContent = "";
    }
  }

  updateData() {
    // Account doesn't need external data yet, but good to have signature format matched
  }
}

customElements.define("screen-account", ScreenAccount);
