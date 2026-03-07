class ScreenDict extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./styles/screen-dict.css" />
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

        <div class="divider"></div>

        <h3 class="section-title">Sinais</h3>
        <div id="dictSignalsList" class="list"></div>
      </section>
    `;

    this.searchInput = this.querySelector("#searchInputDict");
    this.setupListeners();
  }

  setupListeners() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.renderDictSignals(e.target.value);
      });
    }
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
      row.querySelector(".play").addEventListener("click", () => {
        alert(
          `Tocar vídeo do sinal: ${s.term}\\n\\n(placeholder — aqui você conecta um vídeo real)`,
        );
      });
      list.appendChild(row);
    });
  }
}

customElements.define("screen-dict", ScreenDict);
