<template>
  <q-page class="q-pa-none bg-black">
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

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { TvsService } from 'src/services/TvsService';
import env from 'src/enviroments/env';
import { io } from 'socket.io-client';

const currentSlide = ref(0);
const playlist = ref([]);
const slideTimeout = ref(null);
let videoElement = null; // Variável para armazenar o vídeo atual

const route = useRoute();
const tvsService = new TvsService();
const socket = io(env.baseURL);

const onSlideChange = (newIndex) => {
  clearTimeout(slideTimeout.value); // Limpa qualquer timeout anterior
  currentSlide.value = newIndex;
  startSlideTimer(); // Reinicia o temporizador ao mudar o slide
  prefetchNextMedia(); // Pré-carrega a próxima mídia
};

const startSlideTimer = () => {
  clearTimeout(slideTimeout.value); // Limpa qualquer timeout anterior

  const currentMedia = playlist.value[currentSlide.value];

  if (currentMedia.type === 'image') {
    slideTimeout.value = setTimeout(() => {
      nextSlide(); // Chama o nextSlide para trocar o slide
    }, currentMedia.time);
  }
  // Se for vídeo, a troca será controlada pelo evento @ended
};

const nextSlide = () => {
  // O módulo de índice garante que a playlist sempre reinicie após o último slide
  currentSlide.value = (currentSlide.value + 1) % playlist.value.length;

  // Reinicia o temporizador após trocar o slide
  startSlideTimer(); // Chama o startSlideTimer para configurar o tempo do novo slide

  // Pré-carregar a próxima mídia
  prefetchNextMedia();
};

const funcaoVideoFim = () => {
  removeVideoElement(); // Remove o vídeo após o fim
  nextSlide();
};

const prefetchNextMedia = () => {
  const nextIndex = (currentSlide.value + 1) % playlist.value.length;
  const nextMedia = playlist.value[nextIndex];

  if (nextMedia.type === 'image') {
    const img = new Image();
    img.src = nextMedia.url;
  } else if (nextMedia.type === 'video') {
    if (videoElement) {
      // Se já existir um vídeo em memória, remova-o
      removeVideoElement();
    }

    videoElement = document.createElement('video');
    videoElement.src = nextMedia.url;
    videoElement.preload = 'auto';
    videoElement.onended = funcaoVideoFim; // Chama a função de finalização
  }
};

const removeVideoElement = () => {
  if (videoElement) {
    // Remove o vídeo do DOM e limpa as referências
    videoElement.remove();
    videoElement = null;
  }
};

socket.on("connect", () => {
  console.log("Conectado ao servidor!");
});

socket.on('playlistUpdated', (data) => {
  const idTv = route.params.id
  const currentTv = data.tvs.find(tv=>tv.identificador?.toString() ===idTv)
  
  if(currentTv) getMidias(); // Chama o getMidias novamente
});

onBeforeUnmount(() => {
  socket.off('playlistUpdated'); // Desconecta o evento ao desmontar o componente
});

// Função para obter as mídias
const getMidias = async () => {
  const id = route.params.id; // Obtém o id da URL através do useRoute

  if (!id) return;

  try {
    const medias = await tvsService.getMidiasByTv(id);

    playlist.value = medias.map((media) => ({
      type: media.type,
      time: media.time,
      url: `${env.baseURL}${media.url}`,
    }));

    if (playlist.value.length > 0) {
      startSlideTimer();
      prefetchNextMedia();
    }
  } catch (error) {
    console.error('Erro ao obter mídias:', error);
  }
};

onMounted(() => {
  getMidias();
});
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
