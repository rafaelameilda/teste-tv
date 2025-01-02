<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      infinite
      :fullscreen="fullscreen"
      ref="carousel"
      :autoplay="autoplay"
      class="text-white rounded-borders"
    >
      <q-carousel-slide
        v-for="(pair, index) in groupedItems"
        :key="index"
        :name="index + 1"
      >
        <div class="row justify-around items-center">
          <q-img
            v-for="(item, idx) in pair"
            :key="idx"
            :src="item.link"
            fit="contain"
            style="max-width: 45%; height: auto"
          >
            <template v-slot:loading>
              <q-spinner-gears color="white" />
            </template>
          </q-img>
        </div>
      </q-carousel-slide>

      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[18, 18]"
          class="text-white rounded-borders"
          style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px"
        >
          <q-toggle
            dense
            dark
            color="orange"
            v-model="autoplay"
            label="Auto Play"
          />
        </q-carousel-control>

        <q-carousel-control
          position="bottom-right"
          :offset="[40, 18]"
          class="q-gutter-xs"
        >
          <q-btn
            push
            round
            dense
            color="orange"
            text-color="white"
            icon="arrow_left"
            @click="$refs.carousel.previous()"
          />
          <q-btn
            push
            round
            dense
            color="orange"
            text-color="white"
            icon="arrow_right"
            @click="$refs.carousel.next()"
          />
        </q-carousel-control>

        <q-carousel-control position="bottom-right" :offset="[3, 18]">
          <q-btn
            push
            round
            dense
            color="orange"
            text-color="white"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="fullscreen = !fullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const items = ref([]);

    const fetchItems = async () => {
      items.value = [
        { type: "img", time: 4000, link: "/images/teste1.jpeg" },
        { type: "img", time: 4000, link: "/images/teste2.jpeg" },
        { type: "img", time: 4000, link: "/images/teste3.jpeg" },
        { type: "img", time: 4000, link: "/images/teste4.jpeg" },
        { type: "img", time: 4000, link: "/images/teste5.jpeg" },
        { type: "img", time: 4000, link: "/images/teste6.jpeg" },
        { type: "img", time: 4000, link: "/images/teste7.jpeg" },
        { type: "img", time: 4000, link: "/images/teste8.jpeg" },
      ];
    };

    // Group items into pairs
    const groupedItems = computed(() => {
      const pairs = [];
      for (let i = 0; i < items.value.length; i += 2) {
        pairs.push(items.value.slice(i, i + 2));
      }
      return pairs;
    });

    onMounted(async () => {
      await fetchItems();
    });

    return {
      fullscreen: ref(false),
      slide: ref(1),
      items,
      groupedItems,
      autoplay: ref(false),
    };
  },
};
</script>

<style scoped></style>
