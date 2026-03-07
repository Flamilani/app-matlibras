// ====== Init ======
async function init() {
  try {
    const res = await fetch("./src/data/data.json");
    if (!res.ok) throw new Error("Erro ao buscar src/data/data.json");

    state.data = await res.json();

    // Atualiza os componentes que dependem de dados do state.data
    const screenSearch = document.querySelector("screen-search");
    if (screenSearch && screenSearch.updateData) screenSearch.updateData();

    const screenDict = document.querySelector("screen-dict");
    if (screenDict && screenDict.updateData) screenDict.updateData();

    const screenLibras = document.querySelector("screen-libras");
    if (screenLibras && screenLibras.updateData) screenLibras.updateData();

    // Define tela inicial
    showScreen("search");
  } catch (err) {
    console.error(err);
    alert("Erro ao iniciar o app. Veja o console.");
  }
}

// Inicializa assim que o DOM principal (e os Web Components simples) estiver pronto
document.addEventListener("DOMContentLoaded", init);
