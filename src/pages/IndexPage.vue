<template>
  <div class="flex flex-center items-center flex-column" style="height: 100vh">
    <div class="carousel-container">
      <q-carousel
        class="custom-carousel"
        v-model="currentSlide"
        animated
        infinite
      >
        <q-carousel-slide
          v-for="(item, index) in items"
          :key="index"
          :name="index + 1"
        >
          <q-img
            v-if="item.type === 'img'"
            :key="item"
            :src="item.link"
            fit="contain"
          >
          </q-img>

          <div v-else-if="item.type === 'video'" class="video-container">
            <video
              :src="item.link"
              autoplay
              muted
              loop
              controls
              style="width: 100%; height: auto"
              @loadeddata="startAutoplay"
            ></video>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
  setup() {
    const items = ref([]);
    const currentSlide = ref(1);
    const timer = ref(null);

    const fetchItems = async () => {
      items.value = [
        { type: "img", time: 4000, link: "/images/segtec.jpeg" },
        {
          type: "video",
          time: 26000,
          link: "/videos/video 1.mp4",
        },
      ];
    };

    const startAutoplay = () => {
      clearTimeout(timer.value);
      const currentItem = items.value[currentSlide.value - 1];

      timer.value = setTimeout(() => {
        currentSlide.value =
          currentSlide.value < items.value.length ? currentSlide.value + 1 : 1;
      }, currentItem.time);
    };

    onMounted(async () => {
      await fetchItems();
      startAutoplay();
    });

    watch(currentSlide, startAutoplay);

    return {
      currentSlide,
      items,
    };
  },
};
</script>

<style scoped>
.carousel-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.custom-carousel {
  width: 100%;
  height: 100%;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
