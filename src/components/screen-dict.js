import "../../assets/styles/screen-dict.css";

class ScreenDict extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="screen-dict" class="screen" aria-label="Dicionário">
        <div class="top-search">
            <span class="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg></span>
            <input id="searchInputDict" type="text" placeholder="Buscar sinais" autocomplete="off"/>
        </div>

        <div class="hero">
            <h2 class="hero__title">Matemática</h2>
        </div>

        <div id="categoryGrid" class="grid"></div>

        <div id="bottomSheetOverlay" class="bottom-sheet-overlay"></div>
        <div id="bottomSheet" class="bottom-sheet">
            <div class="bottom-sheet__header">
                <h3 class="section-title">Sinais</h3>
                <button type="button" id="closeBottomSheet" class="bottom-sheet__close">✕</button>
            </div>
            <div class="bottom-sheet__content">
                <div id="dictSignalsList" class="list"></div>
            </div>
        </div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputDict");
    this.setupListeners();
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.renderDictSignals(e.target.value);
        if (e.target.value.trim().length > 0) {
          this.openBottomSheet();
        } else if (!state.selectedCategory) {
          this.closeBottomSheet();
        }
      });
    }

    const closeBtn = this.querySelector("#closeBottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");

    if (closeBtn)
      closeBtn.addEventListener("click", () => this.closeBottomSheet());
    if (overlay)
      overlay.addEventListener("click", () => this.closeBottomSheet());
  }

  openBottomSheet() {
    const sheet = this.querySelector("#bottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");
    if (sheet) sheet.classList.add("active");
    if (overlay) overlay.classList.add("active");
  }

  closeBottomSheet() {
    const sheet = this.querySelector("#bottomSheet");
    const overlay = this.querySelector("#bottomSheetOverlay");
    if (sheet) sheet.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    state.selectedCategory = null;
  }

  updateData() {
    this.renderCategoryGrid();
    this.renderDictSignals();
  }

  renderCategoryGrid() {
    const grid = this.querySelector("#categoryGrid");
    if (!grid || !state.data) return;
    grid.innerHTML = "";

    state.data.categories.forEach((cat) => {
      const iconsMap = {
        numero: "🔢",
        operacoes: "➗",
        algebra: "🧮",
        calculo: "📈",
        logica: "🧠",
        estatistica: "📊",
      };
      const catIcon = iconsMap[cat.id] || "📘";

      const card = document.createElement("button");
      card.type = "button";
      card.className = "grid-card";
      card.innerHTML = `
        <div class="grid-card__icon">${catIcon}</div>
        <p class="grid-card__title">${escapeHtml(cat.title)}</p>
        <p class="grid-card__subtitle">${escapeHtml(cat.subtitle)}</p>
      `;
      card.addEventListener("click", () => {
        state.selectedCategory = cat.id;
        this.renderDictSignals(this.searchInput.value);
        this.openBottomSheet();
      });
      grid.appendChild(card);
    });
  }

  renderDictSignals(filterText = "") {
    const list = this.querySelector("#dictSignalsList");
    if (!list || !state.data) return;
    list.innerHTML = "";

    const text = (filterText || "").trim().toLowerCase();
    const selected = state.selectedCategory;

    let items = state.data.signals;

    // filtro por categoria
    if (selected) items = items.filter((s) => s.category === selected);

    // filtro por texto
    if (text) items = items.filter((s) => s.term.toLowerCase().includes(text));

    if (items.length === 0) {
      list.innerHTML = `<div class="list-item">
        <div class="list-item__left">
          <h4>Nenhum sinal encontrado</h4>
          <p>Tente outra palavra ou categoria.</p>
        </div>
        <span class="play">—</span>
      </div>`;
      return;
    }

    items.forEach((s) => {
      const catName = categoryName(s.category);
      const row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div class="list-item__left">
          <h4>${escapeHtml(s.term)}</h4>
          <p>${escapeHtml(catName)} • ${escapeHtml(s.topic)}</p>
        </div>
        <button class="play" type="button">▶︎</button>
      `;
      // Torna a linha inteira clicável
      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        if (s.video) {
          if (window.openVideoModal) {
            window.openVideoModal(s.video, s.term);
          }
        } else {
          alert(`Vídeo em breve para: ${s.term}`);
        }
      });
      list.appendChild(row);
    });
  }
}

customElements.define("screen-dict", ScreenDict);
