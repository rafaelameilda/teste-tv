<template>
  <q-page
    class="flex flex-center q-pa-md"
    :class="{ 'overlay-active': showOverlay }"
  >
    <div class="row justify-center q-gutter-x-lg q-gutter-y-lg">
      <q-card
        v-for="(card, index) in cards"
        :key="index"
        :bordered="true"
        :class="['card-container', card.bgClass, 'text-white']"
        @mouseenter="showOverlay = true"
        @mouseleave="showOverlay = false"
        @click="goToRoute(card.path)"
      >
        <q-card-section>
          <div class="text-h5 text-center">
            <q-icon :name="card.icon" size="5rem" class="icon-hover" />
          </div>
          <div class="text-h5 text-center q-mt-md">{{ card.title }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const showOverlay = ref(false);

const cards = [
  {
    title: 'Cadastro de Mídias',
    icon: 'fa-solid fa-photo-film',
    bgClass: 'bg-light-blue',
    path: 'register/midia',
  },
  {
    title: 'Cadastro de Playlist',
    icon: 'fa-solid fa-compact-disc',
    bgClass: 'bg-blue-grey',
    path: 'register/playlist',
  },
  {
    title: 'Cadastro de TVs',
    icon: 'fa-solid fa-tv',
    bgClass: 'bg-light-green',
  },
];

const router = useRouter();
const goToRoute = (path) => router.push(path);
</script>

<style scoped>
.q-page {
  position: relative;
  transition: background-color 0.5s ease;
}

.q-page.overlay-active {
  background-color: rgba(0, 0, 0, 0.5);
}

.card-container {
  position: relative;
  width: 30rem;
  min-height: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  transition: transform 0.5s, box-shadow 0.5s;
  cursor: pointer;
  z-index: 1;
}

.card-container:hover {
  transform: translateY(-8px) scale(1.08);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.icon-hover {
  transition: color 0.5s, transform 0.5s;
}

.card-container:hover .icon-hover {
  color: #ffeb3b;
  transform: scale(1.1);
}
</style>
