const { state, setupNav, setupSearchInputs, setupAuth, renderCategoryGrid, renderDictSignals, renderLessons, loadAuth, renderHomeResults, showScreen } = require("./app");


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
