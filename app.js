// ====== Estado ======
const state = {
  data: null,
  activeRoute: "search",
  selectedCategory: null
};

// ====== Helpers ======
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

function setHeader(title) {
  $("#headerTitle").textContent = title;
}

function showScreen(route) {
  state.activeRoute = route;

  // header
  const titles = {
    search: "",
    dict: "Dicionário",
    libras: "LIBRAS",
    account: "Conta"
  };
  setHeader(titles[route] ?? "App");

  // screens
  $all(".screen").forEach(s => s.classList.remove("is-active"));
  $(`#screen-${route}`).classList.add("is-active");

  // bottom nav highlight
  $all(".nav-item").forEach(b => b.classList.remove("is-active"));
  $all(`.nav-item[data-route="${route}"]`).forEach(b => b.classList.add("is-active"));
}

// ====== Render ======
function renderHomeResults(items) {
  const list = $("#resultsList");
  list.innerHTML = "";

  $("#resultsCount").textContent = String(items.length);

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

  items.slice(0, 20).forEach(item => {
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

function renderCategoryGrid() {
  const grid = $("#categoryGrid");
  grid.innerHTML = "";

  state.data.categories.forEach(cat => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "grid-card";
    card.innerHTML = `
      <p class="grid-card__title">${escapeHtml(cat.title)}</p>
      <p class="grid-card__subtitle">${escapeHtml(cat.subtitle)}</p>
    `;
    card.addEventListener("click", () => {
      state.selectedCategory = cat.id;
      renderDictSignals();
    });
    grid.appendChild(card);
  });
}

function renderDictSignals(filterText = "") {
  const list = $("#dictSignalsList");
  list.innerHTML = "";

  const text = (filterText || "").trim().toLowerCase();
  const selected = state.selectedCategory;

  let items = state.data.signals;

  // filtro por categoria
  if (selected) items = items.filter(s => s.category === selected);

  // filtro por texto
  if (text) items = items.filter(s => s.term.toLowerCase().includes(text));

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

  items.forEach(s => {
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
      alert(`Tocar vídeo do sinal: ${s.term}\n\n(placeholder — aqui você conecta um vídeo real)`);
    });
    list.appendChild(row);
  });
}

function renderLessons() {
  const box = $("#lessonsList");
  box.innerHTML = "";

  state.data.lessons.forEach(lesson => {
    const card = document.createElement("div");
    card.className = "lesson";
    card.innerHTML = `
      <p class="lesson__title">${escapeHtml(lesson.title)}</p>
      <video class="lesson__video" controls ${lesson.videoUrl ? "" : "poster=''"}>
        ${lesson.videoUrl ? `<source src="${lesson.videoUrl}" type="video/mp4" />` : ""}
        Seu navegador não suporta vídeo.
      </video>
    `;
    box.appendChild(card);
  });
}

// ====== Conta (login simples) ======
function loadAuth() {
  const email = localStorage.getItem("auth_email");
  if (email) {
    $("#loginForm").classList.add("is-hidden");
    $("#accountBox").classList.remove("is-hidden");
    $("#userEmail").textContent = email;
  } else {
    $("#loginForm").classList.remove("is-hidden");
    $("#accountBox").classList.add("is-hidden");
    $("#userEmail").textContent = "";
  }
}

// ====== Busca ======
function searchSignals(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return [];
  return state.data.signals.filter(s => s.term.toLowerCase().includes(q));
}

function categoryName(categoryId) {
  const c = state.data.categories.find(x => x.id === categoryId);
  return c ? c.title : categoryId;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ====== Eventos ======
function setupNav() {
  $all(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const route = btn.dataset.route;
      showScreen(route);
    });
  });
}

function setupSearchInputs() {
  // Home search
  $("#searchInputHome").addEventListener("input", (e) => {
    const items = searchSignals(e.target.value);
    renderHomeResults(items);
  });

  // Dict search
  $("#searchInputDict").addEventListener("input", (e) => {
    renderDictSignals(e.target.value);
  });

  // Camera/mic placeholders
  $("#btnCamera").addEventListener("click", () => {
    alert("Câmera (placeholder). Aqui você pode integrar leitura por câmera depois.");
  });
  $("#btnMic").addEventListener("click", () => {
    alert("Microfone (placeholder). Aqui você pode integrar voz depois.");
  });
}

function setupAuth() {
  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim();
    const pass = $("#password").value; // (protótipo)
    if (!email || !pass) return;

    localStorage.setItem("auth_email", email);
    loadAuth();
    alert("Login salvo (protótipo).");
  });

  $("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("auth_email");
    loadAuth();
  });
}

// ====== Init ======
async function init() {
  const res = await fetch("./data.json");
  state.data = await res.json();

  setupNav();
  setupSearchInputs();
  setupAuth();

  renderCategoryGrid();
  renderDictSignals();
  renderLessons();
  loadAuth();

  // inicializa home sem resultados
  renderHomeResults([]);

  showScreen("search");
}

init().catch(err => {
  console.error(err);
  alert("Erro ao iniciar o app. Veja o console.");
});
