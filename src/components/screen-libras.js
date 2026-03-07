class ScreenLibras extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="./assets/styles/screen-libras.css" />
      <section id="screen-libras" class="screen" aria-label="LIBRAS">
          <h2 class="screen-title">Aulas básicas de Matemática</h2>
          <div id="lessonsList" class="lesson-list"></div>
      </section>
    `;
  }

  updateData() {
    this.renderLessons();
  }

  renderLessons() {
    const box = this.querySelector("#lessonsList");
    if (!box || !state.data) return;
    box.innerHTML = "";

    state.data.lessons.forEach((lesson) => {
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
}

customElements.define("screen-libras", ScreenLibras);
