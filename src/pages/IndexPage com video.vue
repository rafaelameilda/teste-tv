<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="currentSlide"
      animated
      arrows
      infinite
      :fullscreen="fullscreen"
    >
      <q-carousel-slide
        v-for="(item, index) in items"
        :key="index"
        :name="index + 1"
      >
        <img
          v-if="item.type === 'img'"
          :src="item.link"
          class="absolute-full"
        />

        <div v-else-if="item.type === 'video'" class="absolute-full">
          <iframe
            class="absolute-full"
            :src="`${item.link}?autoplay=1&mute=0`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <q-carousel-control position="bottom-right" :offset="[18, 18]">
          <q-btn
            push
            round
            dense
            color="white"
            text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {
  setup() {
    const items = ref([]);
    const currentSlide = ref(1);
    const timer = ref(null);

    const fetchItems = async () => {
      items.value = [
        {
          type: "img",
          time: 4000,
          link: "https://cdn.quasar.dev/img/mountains.jpg",
        },
        {
          type: "img",
          time: 4000,
          link: "https://cdn.quasar.dev/img/parallax1.jpg",
        },
        {
          type: "video",
          time: 4000,
          link: "https://www.youtube.com/embed/k3_tw44QsZQ",
        },
      ];
    };

    const startAutoplay = () => {
      clearTimeout(timer.value);
      const currentItem = items.value[currentSlide.value - 1];
      timer.value = setTimeout(() => {
        currentSlide.value =
          currentSlide.value < items.value.length ? currentSlide.value + 1 : 1;
      }, currentItem?.time || 4000);
    };

    onMounted(async () => {
      await fetchItems();
      startAutoplay();
    });

    watch(currentSlide, startAutoplay);

    return {
      items,
      currentSlide,
      fullscreen: ref(false),
    };
  },
};
</script>

<style></style>
