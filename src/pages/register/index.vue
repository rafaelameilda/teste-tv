<template>
  <q-page class="q-pa-sm items-start q-gutter-sm">
    <q-toolbar class="bg-light-blue text-white">
      <q-toolbar-title class="text-subtitle1">
        {{ getPageTitle }}
      </q-toolbar-title>
    </q-toolbar>
    <router-view />
  </q-page>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "IndexRegister",
  setup() {
    const $route = useRoute();

    return { getPageTitle: computed(() => $route.meta.title) };
  },
};
</script>

<style lang="sass" scoped>
*
  font-family: "Poppins", sans-serif
</style>
