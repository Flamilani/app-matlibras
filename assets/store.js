// ====== Estado Compartilhado ======
const state = {
  data: null,
  activeRoute: "search",
  selectedCategory: null,
};

// ====== Helpers ======
function $(sel) {
  return document.querySelector(sel);
}
function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function categoryName(categoryId) {
  if (!state.data) return categoryId;
  const c = state.data.categories.find((x) => x.id === categoryId);
  return c ? c.title : categoryId;
}

// Global functions that trigger app-level re-rendering
function setHeader(title) {
  const headerTitle = $("#headerTitle");
  if (headerTitle) headerTitle.textContent = title;
}

function showScreen(route) {
  state.activeRoute = route;

  // header
  const titles = {
    search: "",
    dict: "Dicionário",
    libras: "Libras",
    account: "Conta",
  };
  setHeader(titles[route] ?? "App");

  // screens
  $all(".screen").forEach((s) => s.classList.remove("is-active"));
  const activeScreen = $(`#screen-${route}`);
  if (activeScreen) activeScreen.classList.add("is-active");

  // bottom nav highlight
  $all(".nav-item").forEach((b) => b.classList.remove("is-active"));
  $all(`.nav-item[data-route="${route}"]`).forEach((b) =>
    b.classList.add("is-active"),
  );
}
