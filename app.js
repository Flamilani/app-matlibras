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

    // Define tela inicial dependendo da autenticação
    const initializeRoute = () => {
      if (window.Clerk && window.Clerk.user) {
        showScreen("search"); // Usuário logado vai para pesquisa local
      } else {
        showScreen("account"); // Deslogado vai para conta
      }
    };

    if (window.isClerkLoaded) {
      initializeRoute();
    } else {
      window.addEventListener("clerk-loaded", initializeRoute, { once: true });
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao iniciar o app. Veja o console.");
  }
}

// Inicializa assim que o DOM principal (e os Web Components simples) estiver pronto
document.addEventListener("DOMContentLoaded", init);
