<template>
  <q-page>
    <q-carousel
      v-model="currentSlide"
      transition-prev="slide-right"
      transition-next="slide-left"
      class="full-screen"
      @slide="onSlideChange"
      arrows
      infinite
    >
      <q-carousel-slide
        v-for="(media, index) in playlist"
        :key="index"
        :name="index"
        class="full-screen"
      >
        <img
          v-if="media.type === 'image'"
          :src="media.url"
          alt="Mídia"
          class="full-screen"
        />
        <video
          v-if="media.type === 'video'"
          :src="media.url"
          autoplay
          muted
          class="full-screen"
          @ended="funcaoVideoFim"
        ></video>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      playlist: [
        { type: "video", url: "/videos/video 1.mp4" },
        // { type: "image", time: 5000, url: "/images/segtec.jpeg" },
        // { type: "image", time: 5000, url: "/images/imagem1.jpeg" },
        // { type: "image", time: 5000, url: "/images/imagem2.jpeg" },
        // { type: "image", time: 5000, url: "/images/imagem3.jpeg" },
        // { type: "image", time: 5000, url: "/images/hoje.jpeg" },
        // { type: "video", url: "/videos/hoje.mp4" },
      ],
      slideTimeout: null,
      videoElement: null, // Variável para armazenar o vídeo atual
    };
  },
  mounted() {
    this.startSlideTimer(); // Inicia o temporizador no primeiro slide
    this.prefetchNextMedia(); // Pré-carrega a próxima mídia
  },
  methods: {
    onSlideChange(newIndex) {
      clearTimeout(this.slideTimeout); // Limpa qualquer timeout anterior
      this.currentSlide = newIndex;
      this.startSlideTimer(); // Reinicia o temporizador ao mudar o slide
      this.prefetchNextMedia(); // Pré-carrega a próxima mídia
    },

    startSlideTimer() {
      clearTimeout(this.slideTimeout); // Limpa qualquer timeout anterior

      const currentMedia = this.playlist[this.currentSlide];

      if (currentMedia.type === "image") {
        this.slideTimeout = setTimeout(() => {
          this.nextSlide(); // Chama o nextSlide para trocar o slide
        }, currentMedia.time);
      }
      // Se for vídeo, a troca será controlada pelo evento @ended
    },

    nextSlide() {
      // O módulo de índice garante que a playlist sempre reinicie após o último slide
      this.currentSlide = (this.currentSlide + 1) % this.playlist.length;

      // Reinicia o temporizador após trocar o slide
      this.startSlideTimer(); // Chama o startSlideTimer para configurar o tempo do novo slide

      // Pré-carregar a próxima mídia
      this.prefetchNextMedia();
    },

    funcaoVideoFim(dados) {
      this.removeVideoElement(); // Remove o vídeo após o fim
      this.nextSlide();
    },

    prefetchNextMedia() {
      const nextIndex = (this.currentSlide + 1) % this.playlist.length;
      const nextMedia = this.playlist[nextIndex];

      if (nextMedia.type === "image") {
        const img = new Image();
        img.src = nextMedia.url;
      } else if (nextMedia.type === "video") {
        if (this.videoElement) {
          // Se já existir um vídeo em memória, remova-o
          this.removeVideoElement();
        }

        this.videoElement = document.createElement("video");
        this.videoElement.src = nextMedia.url;
        this.videoElement.preload = "auto";
        this.videoElement.onended = this.funcaoVideoFim; // Chama a função de finalização
      }
    },

    removeVideoElement() {
      if (this.videoElement) {
        // Remove o vídeo do DOM e limpa as referências
        this.videoElement.remove();
        this.videoElement = null;
      }
    },
  },
};
</script>

<style>
.full-screen {
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  background: transparent;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
