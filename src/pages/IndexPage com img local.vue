<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      infinite
      autoplay
      style="width: 100%; height: 100%"
      transition-prev="jump-right"
      transition-next="jump-left"
      arrows
      control-color="yellow"
    >
      <q-carousel-slide
        v-for="(pair, index) in groupedItems"
        :key="index"
        :name="index + 1"
      >
        <div class="flex row justify-between">
          <q-img
            v-for="(item, idx) in pair"
            :key="idx"
            :src="item.link"
            fit="contain"
            style="max-width: 45%; height: auto"
          >
          </q-img>
        </div>
      </q-carousel-slide>
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
      slide: ref(1),
      items,
      groupedItems,
    };
  },
};
</script>

<style scoped></style>
