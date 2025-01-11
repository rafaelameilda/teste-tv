<template>
  <q-page class="q-pa-none bg-black">
    <q-carousel
      v-model="currentSlide"
      :infinite="true"
      transition-prev="slide-right"
      transition-next="slide-left"
      class="full-screen"
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
          loop
          muted
          class="full-screen"
          v-on:ended="funcaoVideoFim"
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
        {
          type: "video",
          time: 26000,
          url: "/videos/video 1.mp4",
        },
        { type: "image", time: 4000, url: "/images/segtec.jpeg" },
      ],
    };
  },
  mounted() {
    // setInterval(() => {
    //   this.nextSlide();
    // }, 3000);
  },

  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.playlist.length;
    },

    funcaoVideoFim(dados) {
      console.log(dados);
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
