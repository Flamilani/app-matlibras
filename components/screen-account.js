class ScreenAccount extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./styles/screen-account.css" />
      <section id="screen-account" class="screen" aria-label="Conta">
          <div class="card">
              <form id="loginForm" class="form">
                  <label class="label" for="email">E-mail</label>
                  <input id="email" class="input" type="email" placeholder="exemplo@gmail.com" required />

                  <label class="label" for="password">Senha</label>
                  <input id="password" class="input" type="password" placeholder="••••••••" required />

                  <button class="btn" type="submit">Entrar</button>
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
