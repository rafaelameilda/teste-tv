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
    ? ""
    : calculateTime(time1.value, time2.value, operation.value)
);
</script>

<template>
  <q-card class="q-pa-lg q-gutter-md" >
    <q-card-section class="q-gutter-md">
      <q-input v-model="time1" label="Hora 1 (HH:MM)" mask="##:##" filled />
      <q-input v-model="time2" label="Hora 2 (HH:MM)" mask="##:##" filled />
      
      <q-btn-toggle
        v-model="operation"
        toggle-color="primary"
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
</template>
