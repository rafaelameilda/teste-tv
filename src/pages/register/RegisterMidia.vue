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
            @click="sendFile"
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
        row-key="id"
      >
        <!-- Cabeçalho da tabela -->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th
              v-for="col in columns"
              :key="col.name"
              :props="props"
              class="headdress"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="q-gutter-xs">
                <q-btn
                  size="md"
                  color="negative"
                  rounded
                  flat
                  icon="delete"
                  @click="deleteMidia(props.row.id)"
                >
                  <q-tooltip class="bg-light-blue text-white"
                    >Excluir</q-tooltip
                  >
                </q-btn>
              </div>
            </q-td>

            <q-td v-for="col in columns" :key="col.name" :props="props">
              <div v-if="col.name === 'caminho'">
                <q-btn
                  dense
                  outline
                  color="light-blue"
                  label="Visualizar"
                  @click="abrirModal(props.row.url)"
                />
              </div>
              <span v-else>
                {{
                  col.format
                    ? col.format(props.row[col.field], props.row)
                    : props.row[col.field]
                }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <q-dialog v-model="modalVisible" persistent>
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="bg-light-blue">
        <div class="text-h6 text-white">Visualização de Mídia</div>
        <div class="text-h8 text-white">
          Está é uma prévia da mídia cadastrada
        </div>
      </q-card-section>

      <q-card-section>
        <div v-if="isImage(currentMediaPath)">
          <img :src="currentMediaPath" alt="Mídia" class="full-width" />
        </div>
        <div v-else-if="isVideo(currentMediaPath)">
          <video muted="false" controls autoplay class="full-width">
            <source :src="currentMediaPath" type="video/mp4" />
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      </q-card-section>

      <q-card-actions>
        <div class="col-12 col-md-auto q-pa-xs">
          <q-btn
            color="light-blue"
            label="Fechar"
            outline
            icon="far fa-window-close"
            class="full-width"
            @click="modalVisible = false"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
import env from 'src/enviroments/env';

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
  {
    name: 'caminho',
    field: 'caminho',
    label: 'Visualizar',
    align: 'left',
    sortable: true,
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
    const modalVisible = ref(false);
    const currentMediaPath = ref('');

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

    const checkFileType = (files) =>
      files.filter((file) => ['image/png'].includes(file.type));

    const sendFile = async () => {
      if (!currentFile.value) return;

      try {
        $q.loading.show({
          message: 'Enviando arquivo...',
          backgroundColor: 'blue-grey',
        });

        const formData = new FormData();
        formData.append('file', currentFile.value);

        await midiaService.createMidia(formData);

        $q.notify({
          type: 'positive',
          message: 'Arquivo enviado com sucesso!',
        });

        await getMidiasListHandle();
        clearFilesList();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao enviar o arquivo.',
        });
      } finally {
        $q.loading.hide();
      }
    };

    const deleteMidia = async (id: string) => {
      try {
        $q.loading.show({
          message: 'Deletando mídia...',
          backgroundColor: 'blue-grey',
        });

        await midiaService.deleteMidia(id);

        $q.notify({
          type: 'positive',
          message: 'Mídia deletada com sucesso!',
        });

        await getMidiasListHandle();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao deletar mídia.',
        });
      } finally {
        $q.loading.hide();
      }
    };

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

    const abrirModal = (caminho: string) => {
      currentMediaPath.value = env.baseURL + caminho;
      modalVisible.value = true;
    };

    const isImage = (path: string) => /\.(jpg|jpeg|png|gif)$/i.test(path);
    const isVideo = (path: string) => /\.(mp4|webm|ogg)$/i.test(path);

    return {
      handleFileAdded,
      sendFile,
      deleteMidia,
      triggerFileInput,
      onRejected,
      checkFileType,
      currentFile,
      router,
      fileList,
      refsUploader,
      columns,
      modalVisible,
      currentMediaPath,
      abrirModal,
      isImage,
      isVideo,
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

.headdress {
  font-weight: bold;
}
</style>
