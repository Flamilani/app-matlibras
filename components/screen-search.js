class ScreenSearch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./styles/screen-search.css" />
      <section id="screen-search" class="screen is-active" aria-label="Pesquisa">
        <div class="video-card">
            <div class="video-placeholder">
                <div class="video-placeholder__label">Buscar sinais<br/><video width="640" height="360" controls poster="capa.jpg">
                    <source src="Videos/um.mp4" type="video/mp4">                                                                                
                    <source src="Videos/um.webm" type="video/webm">                                                                                
                    Seu navegador não suporta a tag de vídeo.
                </video></div>
            </div>
        </div>

        <div class="search-row">
            <div class="search-input">
                <span class="icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </span>
                <input id="searchInputHome" type="text" placeholder="Buscar sinais" autocomplete="off" />
                <button id="btnCamera" class="icon-btn" title="Câmera (placeholder)" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"/>
                  </svg>
                </button>
            </div>
            <button id="btnMic" class="mic-btn" title="Microfone (placeholder)" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
              </svg>
            </button>
        </div>

        <div class="results">
            <div class="results__head">
                <span class="results__title">Linguagem Matemática</span>
                <span id="resultsCount" class="results__count">0</span>
            </div>
            <div id="resultsList" class="results__list"></div>
        </div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputHome");
    this.btnCamera = this.querySelector("#btnCamera");
    this.btnMic = this.querySelector("#btnMic");

    this.setupListeners();
    // initially render without results, if state data loaded, it will re-render
    this.renderHomeResults([]);
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        const items = this.searchSignals(e.target.value);
        this.renderHomeResults(items);
      });
    }

    if (this.btnCamera) {
      this.btnCamera.addEventListener("click", () => {
        alert(
          "Câmera (placeholder). Aqui você pode integrar leitura por câmera depois.",
        );
      });
    }

    if (this.btnMic) {
      this.btnMic.addEventListener("click", () => {
        alert("Microfone (placeholder). Aqui você pode integrar voz depois.");
      });
    }
  }

  searchSignals(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q || !state.data) return [];
    return state.data.signals.filter((s) => s.term.toLowerCase().includes(q));
  }

  renderHomeResults(items) {
    const list = this.querySelector("#resultsList");
    const count = this.querySelector("#resultsCount");

    if (!list || !count) return;

    list.innerHTML = "";
    count.textContent = String(items.length);

    if (items.length === 0) {
      list.innerHTML = `<div class="result-item">
        <span class="badge">Info</span>
        <div>
          <p class="result-item__title">Nenhum resultado</p>
          <p class="result-item__meta">Digite para buscar sinais no dicionário.</p>
        </div>
      </div>`;
      return;
    }

    items.slice(0, 20).forEach((item) => {
      const catName = categoryName(item.category);
      const el = document.createElement("div");
      el.className = "result-item";
      el.innerHTML = `
        <span class="badge">${catName}</span>
        <div>
          <p class="result-item__title">${escapeHtml(item.term)}</p>
          <p class="result-item__meta">Tópico: ${escapeHtml(item.topic)}</p>
        </div>
      `;
      list.appendChild(el);
    });
  }

  updateData() {
    this.renderHomeResults([]);
  }
}

customElements.define("screen-search", ScreenSearch);
