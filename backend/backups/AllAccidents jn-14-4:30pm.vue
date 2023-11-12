<script setup>
import { onMounted, computed } from "vue";
import { useAccidentStore } from "../stores/accidentStore";
import MyMap from "./MyMap.vue";

const accidentStore = useAccidentStore(); // useAccidentStore() is a function that returns a store object

const accidents = computed(() => {
  return accidentStore.accidents;
});

onMounted(async () => {
  await accidentStore.fetchAccidents();
});
</script>

<template>
  <div>
    <div id="tableau1">
      <div>
        <h1>Accidents</h1>
      </div>

      <div>
        <h1>Totaux</h1>
      </div>
      <div>
        <table>
          <thead>
            <th>Nb de morts</th>
            <th>Nb. de blessés graves</th>
            <th>Nb. de blessés légers</th>
            <th>Nb. de véhicules impliqués</th>
            <th>Nb. de victimes impliquées</th>
          </thead>
          <tbody>
            <tr>
              <td>{{ accidents.totalMorts }}</td>
              <td>{{ accidents.totalBlessesGraves }}</td>
              <td>{{ accidents.totalBlessesLegers }}</td>
              <td>{{ accidents.totalVehiculesImpliques }}</td>
              <td>{{ accidents.totalVictimesImpliques }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="tableau2">
      <div>
        <h1>Totaux</h1>
      </div>
      <div>
        <table>
          <thead>
            <th>Nb de morts</th>
            <th>Nb. de blessés graves</th>
            <th>Nb. de blessés légers</th>
            <th>Nb. de véhicules impliqués</th>
            <th>Nb. de victimes impliquées</th>
          </thead>
          <tbody>
            <tr>
              <td>{{ accidents.totalMorts }}</td>
              <td>{{ accidents.totalBlessesGraves }}</td>
              <td>{{ accidents.totalBlessesLegers }}</td>
              <td>{{ accidents.totalVehiculesImpliques }}</td>
              <td>{{ accidents.totalVictimesImpliques }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <h2>MAP</h2>
      <MyMap />
    </div>
  </div>
</template>

<style scoped></style>
