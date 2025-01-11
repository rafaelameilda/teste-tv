<template>
  <q-card bordered>
    <q-card-section>
      <div class="full-width clickable-upload" @click="triggerFileInput">
        <q-uploader
          color="light-blue"
          ref="refsUploader"
          :hide-upload-btn="true"
          :multiple="false"
          label="Clique aqui para escolher o arquivo"
          class="full-width"
          :filter="checkFileType"
          @rejected="onRejected"
          @added="handleFileAdded"
        />
      </div>
    </q-card-section>

    <q-card-actions class="q-gutter-xs">
      <div class="row full-width">
        <div class="col-12 col-md-2 q-pa-xs">
          <q-btn
            outline
            icon="arrow_back"
            label="Voltar"
            color="light-blue"
            @click="router.go(-1)"
            class="full-width"
          />
        </div>

        <div class="col-12 col-md-10 q-pa-xs">
          <q-btn
            icon="cloud_upload"
            outline
            label="Enviar Arquivo"
            color="light-blue"
            @click="enviarArquivo()"
            class="full-width"
            :disable="!currentFile"
          />
        </div>
      </div>
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <q-table
        :title="'Arquivos Cadastrados'"
        :rows="fileList"
        :columns="columns"
        row-key="name"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const fileList = ref([]);
const refsUploader = ref();
const currentFile = ref();
const router = useRouter();
const $q = useQuasar();

const columns = [
  { name: "name", label: "Nome do Arquivo", align: "left", field: "name" },
  { name: "size", label: "Tamanho", align: "center", field: "size" },
];

const enviarArquivo = () => {
  if (!currentFile.value) return;
  const newFile = {
    name: currentFile.value.name,
    size: `${(currentFile.value.size / 1024).toFixed(2)} KB`,
  };
  fileList.value.push(newFile);
  currentFile.value = undefined;
  testeFile();
};

function checkFileType(files) {
  return files.filter((file) => file.type === "image/png");
}

function onRejected(rejectedEntries) {
  // Notify plugin needs to be installed
  // https://v2.quasar.dev/quasar-plugins/notify#Installation
  console.log(rejectedEntries);
  $q.notify({
    type: "negative",
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
}

const testeFile = (teste) => {
  const uploader = refsUploader.value;
  if (uploader) {
    uploader.reset(); // Remove files from the uploader queue
  }
};

const triggerFileInput = () => {
  const uploader = refsUploader.value;
  if (uploader) {
    uploader.pickFiles();
  }
};

const handleFileAdded = (files) => {
  const file = files[0];

  if (file) {
    currentFile.value = file;
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.clickable-upload {
  cursor: pointer;
  border: 2px dashed #ccc; /* Estilo de borda visual */
  padding: 20px;
  text-align: center;
  background-color: #f1e7e7;
  border-radius: 8px;
  font-size: 16px;
}

.clickable-upload:hover {
  background-color: #f1e7e7;
}
</style>
