import "../../assets/styles/video-modal.css";

class VideoModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="videoModalOverlay" class="video-modal-overlay">
        <div class="video-modal">
          <button id="closeVideoBtn" class="video-modal__close">✕</button>
          <video id="videoPlayer" class="video-modal__player" controls controlslist="nofullscreen" playsinline>
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div class="video-modal__info">
            <h3 id="videoTitle"></h3>
          </div>
        </div>
      </div>
    `;

    this.overlay = this.querySelector("#videoModalOverlay");
    this.closeBtn = this.querySelector("#closeVideoBtn");
    this.videoPlayer = this.querySelector("#videoPlayer");
    this.videoTitle = this.querySelector("#videoTitle");

    this.setupListeners();
  }

  setupListeners() {
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", (e) => {
      // close only if overlay is clicked, not inner contents
      if (e.target === this.overlay) this.close();
    });
  }

  open(videoUrl, title) {
    if (!videoUrl) {
      alert("Vídeo não disponível");
      return;
    }
    this.videoTitle.textContent = title || "";
    this.videoPlayer.src = videoUrl;
    this.overlay.classList.add("active");
    this.videoPlayer
      .play()
      .catch((e) => console.log("Failed to play video:", e));
  }

  close() {
    this.overlay.classList.remove("active");
    this.videoPlayer.pause();
    this.videoPlayer.currentTime = 0;
  }
}

customElements.define("video-modal", VideoModal);

// Helper global function to be used by other components
window.openVideoModal = function (url, title) {
  const modal = document.querySelector("video-modal");
  if (modal) {
    modal.open(url, title);
  }
};
