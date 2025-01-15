<template>
  <q-card bordered>
    <q-expansion-item
      expand-separator
      icon="filter_list"
      class="shadow-1 overflow-hidden col-12"
      label="Cadastrar PlayList"
      v-model="expandedForm"
      caption="Clique aqui para lançar uma PlayList!"
    >
      <q-separator />
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
            :rules="rulesInput('Nome da PlayList deve ser informado')"
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
            :rules="rulesInput('Descrição da PlayList deve ser informado')"
          />
        </q-form>
      </q-card-section>
    </q-expansion-item>

    <q-separator />

    <q-card-actions>
      <div class="row full-width">
        <div class="col-12 col-md-2 q-pa-xs">
          <q-btn
            outline
            icon="fa-solid fa-arrow-left"
            label="Voltar"
            color="orange"
            @click="router.go(-1)"
            class="full-width"
          />
        </div>

        <div class="col-12 col-md-10 q-pa-xs">
          <q-btn
            icon="fa-solid fa-floppy-disk"
            outline
            label="Salvar"
            color="blue-grey"
            class="full-width"
            @click="createPlayList"
          />
        </div>
      </div>
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <q-table
        :title="'PlayLists Cadastradas'"
        row-key="id"
        :columns="columns"
        :rows="playlistList"
      >
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
                  icon="fa-solid fa-trash"
                  @click="deletePlayList(props.row.id)"
                >
                  <q-tooltip class="bg-blue-grey text-white"
                    >Excluir Play List</q-tooltip
                  >
                </q-btn>
                <q-btn
                  size="md"
                  color="blue-grey"
                  rounded
                  flat
                  icon="fa-solid fa-plus"
                  @click="abrirModalEdicao(props.row)"
                >
                  <q-tooltip class="bg-blue-grey text-white"
                    >Adicionar Mídias a Play List</q-tooltip
                  >
                </q-btn>
                <q-btn
                  v-if="props.row.midias.length"
                  size="md"
                  color="blue-grey"
                  rounded
                  flat
                  icon="fa-solid fa-eye"
                  @click="verTvHomeHandle(props.row)"
                >
                  <q-tooltip class="bg-blue-grey text-white"
                    >Visualizar PlayList TV</q-tooltip
                  >
                </q-btn>
              </div>
            </q-td>

            <q-td v-for="col in columns" :key="col.name" :props="props">
              <span>
                {{
                  col.format
                    ? col.format(props.row[col.field], props.row)
                    : props.row[col.field]
                }}
              </span>
            </q-td>
          </q-tr>

          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">{{ props.row }}</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <q-dialog v-model="showModalEdit" persistent>
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="bg-blue-grey">
        <div class="text-h6 text-white">
          Selecionar mídias que deseja adicionar
        </div>
        <div class="text-h8 text-white">
          Lembre-se que quanto mais leve o tamanho total da lista melhor a
          exibição
        </div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="fileList"
          row-key="id"
          :columns="midiaColumns"
          selection="multiple"
          v-model:selected="selectedMidias"
        >
          <template v-slot:body-cell-selecionado="props">
            <q-td :props="props">
              <q-checkbox v-model="props.selected" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          outline
          label="Cancelar"
          icon="fa-solid fa-xmark"
          color="negative"
          @click="showModalEdit = false"
        />
        <q-btn
          outline
          label="Adicionar Mídias"
          color="blue-grey"
          icon="fa-solid fa-plus"
          @click="adicionarMidiaNaPlayList"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showModalTV" persistent>
    <q-card style="width: 50%; max-width: 100%">
      <q-card-section class="bg-blue-grey">
        <div class="text-h6 text-white">Prévia da exibição da playlist</div>
        <div class="text-h8 text-white">
          A visualização aqui é a mesma que você verá na TV cadastrada
        </div>
      </q-card-section>
      <q-carousel
        control-type="regular"
        control-color="blue-grey"
        next-icon="fas fa-arrow-right"
        prev-icon="fas fa-arrow-left"
        v-model="currentFile"
        arrows
        animated
        infinite
        transition-prev="scale"
        transition-next="scale"
      >
        <q-carousel-slide
          v-for="arquivo in playListTV"
          :key="arquivo.url"
          :name="arquivo.url"
        >
          <q-video
            class="absolute-full"
            v-if="arquivo.type === 'video'"
            :src="arquivo.url"
          />

          <q-img
            class="absolute-full"
            v-if="arquivo.type === 'image'"
            :src="arquivo.url"
          />
        </q-carousel-slide>
      </q-carousel>

      <q-separator />

      <q-card-actions class="q-pa-sm q-gutter-sm">
        <q-btn
          outline
          label="Fechar"
          icon="fa-solid fa-xmark"
          color="negative"
          @click="showModalTV = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { PlayListService } from 'src/services/PlayListService';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { formatDateWithUTC, formatFileSize } from 'src/services/utils';
import { MidiaService } from 'src/services/MidiasService';

import env from 'src/enviroments/env';

const playListService = new PlayListService();
const midiaService = new MidiaService();

const formPlayList = ref({ name: '', description: '' });
const formFieldsRef = ref();
const currentFile = ref();
const expandedForm = ref(false);
const showModalEdit = ref(false);
const showModalTV = ref(false);
const router = useRouter();
const playlistList = ref([]);
const $q = useQuasar();
const fileList = ref([]);
const selectedMidias = ref([]);
const playListTV = ref([]);

const columns = [
  {
    name: 'nome',
    field: 'nome',
    label: 'Nome',
    align: 'left',
    sortable: true,
    format: (row) => row.toUpperCase(),
  },
  {
    name: 'descricao',
    field: 'descricao',
    label: 'Descrição',
    align: 'left',
    sortable: true,
    format: (row) => row.toUpperCase(),
  },
  {
    name: 'criado_em',
    field: 'criado_em',
    label: 'Dt. Cadastro',
    align: 'left',
    sortable: true,
    format: (row) => formatDateWithUTC(row),
  },
];

const midiaColumns = ref([
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

const adicionarMidiaNaPlayList = async () => {
  try {
    await playListService.addMidia(formPlayList.value.id, selectedMidias.value);

    $q.notify({
      type: 'positive',
      message: 'Mídias adicionadas à playlist!',
      timeout: 3000,
      progress: true,
    });

    await getAllPlayListHandle();
    showModalEdit.value = false;
    formPlayList.value = {};
    selectedMidias.value = [];
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao adicionar mídias à playlist!',
      timeout: 3000,
      progress: true,
    });
  }
};

const abrirModalEdicao = async (playlist) => {
  try {
    formPlayList.value = { ...playlist };

    await getMidiasListHandle();
    showModalEdit.value = true;
  } catch {
    $q.notify({
      message: 'Erro ao abrir modal de edição.',
      type: 'negative',
      timeout: 3000,
      progress: true,
    });
  }
};

const getAllPlayListHandle = async () => {
  try {
    $q.loading.show({
      message: 'Pesquisando PlayList',
      backgroundColor: 'blue-grey',
    });

    const playList = await playListService.listPlayList();
    playlistList.value = playList;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao pesquisar playlist.',
      progress: true,
      timeout: 3000,
    });
  } finally {
    $q.loading.hide();
  }
};

const createPlayList = async () => {
  try {
    $q.loading.show({
      message: 'Criando PlayList.',
      backgroundColor: 'blue-grey',
    });
    expandedForm.value = true;

    const valid = await formFieldsRef?.value?.validate(true);
    if (!valid) {
      return $q.notify({
        message: 'Preencha todos os campos obrigatórios!',
        type: 'warning',
        progress: true,
        timeout: 3000,
      });
    }

    await playListService.createPlayList({ ...formPlayList.value });

    $q.notify({
      type: 'positive',
      message: 'Cadastro realizado com sucesso.',
      progress: true,
      timeout: 3000,
    });

    formPlayList.value = {};
    await formFieldsRef?.value?.resetValidation();
    await formFieldsRef?.value?.resetValidation();
    expandedForm.value = false;
    await getAllPlayListHandle();
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao realizar cadastro.',
      progress: true,
      timeout: 3000,
    });
  } finally {
    $q.loading.hide();
  }
};

const deletePlayList = async (id) => {
  try {
    $q.loading.show({
      message: 'Deletando PlayList...',
      backgroundColor: 'blue-grey',
    });

    await playListService.deletePlayList(id);

    $q.notify({
      type: 'positive',
      message: 'PlayList deletada com sucesso!',
      progress: true,
      timeout: 3000,
    });

    await getAllPlayListHandle();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao deletar PlayList.',
      progress: true,
      timeout: 3000,
    });
  } finally {
    $q.loading.hide();
  }
};

const verTvHomeHandle = async (row) => {
  playListTV.value = row.midias.map((midia) => {
    return {
      type: midia.formato.includes('video') ? 'video' : 'image',
      time: midia.time,
      id: midia.id,
      url: `${env.baseURL}/arquivos/${midia.nome}`,
    };
  });

  currentFile.value = playListTV.value[0].url;

  showModalTV.value = true;
};

const rulesInput = (message) => [(val) => !!val || message];

onBeforeMount(async () => {
  await getAllPlayListHandle();
});
</script>

<style scoped>
.headdress {
  font-weight: bold;
}
</style>
