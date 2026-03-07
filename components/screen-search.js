class ScreenSearch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./styles/screen-search.css" />
      <section id="screen-search" class="screen is-active" aria-label="Pesquisa">
        <div class="search-fullscreen">
            <video class="bg-video" autoplay loop muted playsinline poster="capa.jpg">
                <source src="videos/um.mp4" type="video/mp4">
                <source src="videos/um.webm" type="video/webm">
                Seu navegador não suporta a tag de vídeo.
            </video>
            
            <div class="floating-search">
                <span class="icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                </span>
                <input id="searchInputHome" type="text" placeholder="Busque palavras" autocomplete="off" />
                <button id="btnMic" class="mic-btn" title="Microfone" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/>
                  </svg>
                </button>
            </div>

            <!-- Overlay for search results -->
            <div class="results-overlay" id="resultsOverlay" style="display:none;">
               <div class="results__head" style="margin-bottom: 14px; display:flex; justify-content:space-between; align-items:center;">
                   <span class="results__title" style="font-weight: 800; font-size: 18px;">Resultados</span>
                   <span id="resultsCount" class="results__count" style="font-size: 12px; background: #e2e8f0; padding: 4px 10px; border-radius: 999px;">0</span>
               </div>
               <div id="resultsList" class="results__list" style="display:flex; flex-direction:column; gap:10px;"></div>
            </div>
        </div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputHome");
    this.btnMic = this.querySelector("#btnMic");
    this.resultsOverlay = this.querySelector("#resultsOverlay");

    this.setupListeners();
    // initially hide results
    this.renderHomeResults([]);
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        const query = (e.target.value || "").trim();
        if (query.length > 0) {
          this.resultsOverlay.style.display = "block";
          const items = this.searchSignals(query);
          this.renderHomeResults(items);
        } else {
          this.resultsOverlay.style.display = "none";
        }
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
