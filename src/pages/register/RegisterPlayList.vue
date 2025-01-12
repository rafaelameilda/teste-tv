<template>
  <q-card bordered>
    <q-card-section>
      <q-form class="row row q-col-gutter-xs q-pa-xs" ref="formFieldsRef">
        <q-input
          v-model="formPlayList.name"
          label="Nome da PlayList"
          outlined
          dense
          color="blue-grey"
          clearable
          class="col-12"
        />
        <q-input
          v-model="formPlayList.description"
          label="Descrição da PlayList"
          outlined
          dense
          color="blue-grey"
          clearable
          class="col-12"
          type="textarea"
        />
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <div class="row full-width">
        <div class="col-12 col-md-2 q-pa-xs">
          <q-btn
            outline
            icon="arrow_back"
            label="Voltar"
            color="orange"
            @click="router.go(-1)"
            class="full-width"
          />
        </div>

        <div class="col-12 col-md-10 q-pa-xs">
          <q-btn
            icon="save"
            outline
            label="Salvar"
            color="blue-grey"
            class="full-width"
          />
        </div>
      </div>
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <q-table row-key="id" :rows="playlistList"></q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formPlayList = ref({ name: '', description: '' });
const formFieldsRef = ref();
const router = useRouter();
const playlistList = ref([]);
</script>

<style scoped></style>
