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
          accept=".jpg,.jpeg, .mp4"
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
            color="orange"
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
            @click="sendFile()"
            class="full-width"
            :disable="!currentFile"
          />
        </div>
      </div>
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <q-table
        :title="'Mídias Cadastradas'"
        :columns="columns"
        :rows="fileList"
        row-key="name"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { ref, defineComponent, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { MidiaService } from 'src/services/MidiasService';
import {
  formatDateWithUTC,
  formatFileSize,
  IColumns,
} from 'src/services/utils';

const columns = ref<IColumns<any>[]>([
  {
    name: 'nome_original',
    field: 'nome_original',
    label: 'Nome',
    align: 'left',
    sortable: true,
    format: (row) => row.toUpperCase(),
  },
  {
    name: 'formato',
    field: 'formato',
    label: 'Formato',
    align: 'left',
    sortable: true,
    format: (row) => row.toUpperCase(),
  },
  {
    name: 'tamanho',
    field: 'tamanho',
    label: 'Tamanho',
    align: 'left',
    sortable: true,
    format: (row) => formatFileSize(row),
  },
  {
    name: 'criado_em',
    field: 'criado_em',
    label: 'Dt. Cadastro',
    align: 'left',
    sortable: true,
    format: (row) => formatDateWithUTC(row),
  },
]);

export default defineComponent({
  name: 'RegisterMidia',

  setup() {
    const fileList = ref([]);
    const refsUploader = ref();
    const currentFile = ref();
    const router = useRouter();
    const $q = useQuasar();

    const midiaService = new MidiaService();

    const getMidiasListHandle = async () => {
      try {
        $q.loading.show({
          message: 'Pesquisando mídias cadastradas',
          backgroundColor: 'blue-grey',
        });
        const midias = await midiaService.listMidia();

        fileList.value = midias;
      } catch (error) {
        $q.notify({
          message: 'Erro ao carregar mídias cadastradas',
          timeout: 3000,
          progress: true,
          type: 'negative',
        });
      } finally {
        $q.loading.hide();
      }
    };

    onBeforeMount(async () => {
      await getMidiasListHandle();
    });

    const sendFile = () => {
      if (!currentFile.value) return;

      // TODO ENVIAR ARQUIVO PARA ROTA MIDIA/CREATE

      await getMidiasListHandle();

      clearFilesList();
    };

    const checkFileType = (files) =>
      files.filter((file) => ['image/png'].includes(file.type));

    const onRejected = () => {
      $q.notify({
        type: 'negative',
        message: 'Apenas arquivos .mp4 e .jpeg são aceitos.',
      });
    };

    const clearFilesList = () => {
      currentFile.value = undefined;
      const uploader = refsUploader.value;
      if (uploader) {
        uploader.reset();
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

    return {
      handleFileAdded,
      sendFile,
      triggerFileInput,
      onRejected,
      checkFileType,
      currentFile,
      router,
      fileList,
      refsUploader,
      columns,
    };
  },
});
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
