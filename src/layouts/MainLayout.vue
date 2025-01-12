<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated> </q-header>
    <q-page-container class="main-content">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style lang="scss">
.main-content {
  background-color: $body-color;

  .q-table__bottom,
  .q-table__top,
  .q-card,
  .q-form,
  .q-expansion-item,
  .q-uploader__list,
  .q-table {
    background-color: $body-color;
  }
}
</style>
