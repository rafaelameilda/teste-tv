<template>
  <q-card bordered>
    <q-expansion-item
      expand-separator
      icon="filter_list"
      class="shadow-1 overflow-hidden col-12"
      label="Cadastrar TV"
      v-model="expandedForm"
      caption="Clique aqui para lançar uma TV!"
    >
      <q-separator />
      <q-card-section>
        <q-form class="row row q-col-gutter-xs q-pa-xs" ref="formFieldsRef">
          <q-input
            v-model="formTV.nameTv"
            label="Nome da TV"
            outlined
            dense
            color="light-green"
            clearable
            class="col-12"
            :rules="rulesInput('Nome da TV deve ser informado')"
          />
          <q-select
            v-model="formTV.playList"
            label="PlayList"
            outlined
            dense
            :options="playListsOptions"
            color="light-green"
            clearable
            class="col-12"
            :rules="rulesInput('Uma PlayList deve ser informada')"
            :option-label="
              (option) =>
                `${option.nome} | ${option.midias.length} Mídias Cadastradas`
            "
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
            color="light-green"
            class="full-width"
            @click="createTvs"
          />
        </div>
      </div>
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <q-table title="TVs Cadastradas" :columns="columns" :rows="tvs">
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
                  @click="deleteTv(props.row.id)"
                >
                  <q-tooltip class="bg-light-green text-white"
                    >Excluir Mídia</q-tooltip
                  >
                </q-btn>
                <q-btn
                  size="md"
                  color="light-green"
                  rounded
                  flat
                  icon="fa-solid fa-up-right-from-square"
                  @click="goToTvID(props.row)"
                
                >
                  <q-tooltip class="bg-light-green text-white"
                    >Abrir PlayList</q-tooltip
                  >
                </q-btn>
                <q-btn
                  size="md"
                  color="light-green"
                  rounded
                  flat
                  icon="fa-solid fa-copy"
                  @click="copyLink(props.row)"
            
                >
                  <q-tooltip class="bg-light-green text-white"
                    >Copiar Link da PlayList</q-tooltip
                  >
                </q-btn>
              </div>
            </q-td>

            <q-td v-for="col in columns" :key="col.name" :props="props">
              <div v-if="col.name === 'playlist_nome'">
                <span class="cursor-pointer text-light-green"
                  >{{ props.row[col.name].toUpperCase() }}

                  <q-tooltip class="bg-light-green text-white">{{
                    props.row.playlist_descricao.toUpperCase()
                  }}</q-tooltip></span
                >
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
</template>

<script setup>
import { PlayListService } from 'src/services/PlayListService';
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar,copyToClipboard  } from 'quasar';
import { formatDateWithUTC } from 'src/services/utils';
import { TvsService } from 'src/services/TvsService';

const columns = [
  {
    name: 'nome',
    field: 'nome',
    label: 'Nome TV',
    align: 'left',
    sortable: true,
    format: (row) => row?.toUpperCase(),
  },
  {
    name: 'playlist_nome',
    field: 'playlist_nome',
    label: 'PlayList',
    align: 'left',
    sortable: true,
    format: (row) => row?.toUpperCase(),
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

const playListService = new PlayListService();
const tvsService = new TvsService();

const router = useRouter();
const rulesInput = (message) => [(val) => !!val || message];
const tvs = ref([]);
const playListsOptions = ref([]);
const formFieldsRef = ref();
const $q = useQuasar();
const expandedForm = ref(false);
const formTV = ref({ nameTv: '', playList: undefined });

const getAllPlayListHandle = async () => {
  try {
    $q.loading.show({
      message: 'Pesquisando PlayList',
      backgroundColor: 'blue-grey',
    });

    const playList = await playListService.listPlayList();
    playListsOptions.value = playList.filter((play) => play.midias.length);
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

const getAllTvsHandle = async () => {
  try {
    $q.loading.show({
      message: 'Pesquisando Tvs',
      backgroundColor: 'blue-grey',
    });

    const tvsResponse = await tvsService.listTvs();
    tvs.value = tvsResponse;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Erro ao pesquisar Tvs.',
      progress: true,
      timeout: 3000,
    });
  } finally {
    $q.loading.hide();
  }
};

const createTvs = async () => {
  try {
    $q.loading.show({
      message: 'Criando Tvs.',
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

    await tvsService.createTvs({ ...formTV.value });

    $q.notify({
      type: 'positive',
      message: 'Cadastro realizado com sucesso.',
      progress: true,
      timeout: 3000,
    });

    formTV.value = {};
    await formFieldsRef?.value?.resetValidation();
    await formFieldsRef?.value?.resetValidation();
    expandedForm.value = false;
    await getAllTvsHandle();
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

const deleteTv = async (id) => {
  try {
    $q.loading.show({
      message: 'Deletando Tv...',
      backgroundColor: 'ligth-grey',
    });

    await tvsService.deleteTv(id);

    $q.notify({
      type: 'positive',
      message: 'Tv deletada com sucesso!',
      progress: true,
      timeout: 3000,
    });

    await getAllTvsHandle();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao deletar Tv.',
      progress: true,
      timeout: 3000,
    });
  } finally {
    $q.loading.hide();
  }
};

const goToTvID = async(row)=>{
  const host = window.location.origin; 
  const url = `${host}/#/tv/${row.identificador}`;
  window.open(url, '_blank');
}

const copyLink = async (row) => {
  const host = window.location.origin; 
  const url = `${host}/#/tv/${row.identificador}`;

  try {
    await copyToClipboard(url);
    $q.notify({
      message: 'Link copiado com sucesso!',
      color: 'positive',
      progress: true,
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      message: 'Erro ao copiar o link.',
      color: 'negative',
      progress: true,
      timeout: 3000,
    });
  }
};

onBeforeMount(() => {
  getAllPlayListHandle();
  getAllTvsHandle();
});
</script>

<style scoped>
.headdress {
  font-weight: bold;
}
</style>
