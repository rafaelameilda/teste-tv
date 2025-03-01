<script setup lang="ts">
import { calculateTime, TimeOperation } from "src/utils/timeCalculator";
import { ref, computed } from "vue";

// Estados reativos
const time1 = ref("");
const time2 = ref("");
const operation = ref(TimeOperation.ADD);

// Computed para calcular o resultado automaticamente
const result = computed(() =>
  !time1.value || !time2.value
    ? "--"
    : calculateTime(time1.value, time2.value, operation.value)
);
</script>

<template>
  <q-page class="full-height flex column">
    <!-- Toolbar fixa no topo -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title class="text-subtitle1">
        Calculadora de Horas
      </q-toolbar-title>
    </q-toolbar>

    <!-- Container flex para centralizar o card responsivamente -->
    <div class="flex flex-center col-grow">
      <q-card bordered class="q-pa-md" style="max-width: 650px; width: 90vw;">
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="time1"
            label="Hora 1 (HH:MM)"
            mask="##:##"
            outlined
            color="secondary"
          />
          <q-input
            v-model="time2"
            label="Hora 2 (HH:MM)"
            mask="##:##"
            outlined
            color="secondary"
          />

          <q-btn-toggle
            v-model="operation"
            spread
            class="my-custom-toggle"
            no-caps
            rounded
            unelevated
            toggle-color="secondary"
            color="white"
            text-color="black"
            :options="[
              { label: 'Somar', value: TimeOperation.ADD },
              { label: 'Subtrair', value: TimeOperation.SUBTRACT },
            ]"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center text-h4">
          Resultado: <strong>{{ result }}</strong>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
