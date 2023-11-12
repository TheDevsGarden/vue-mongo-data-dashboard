<script setup>
import { onMounted, computed } from "vue";
import { useAccidentStore } from "../stores/accidentStore";
import MyMap from "./MyMap.vue";

const accidentStore = useAccidentStore();

const totalAccidents = computed(() => {
  return accidentStore.getTotalAccidents;
});

const accidentsParAnnee = computed(() => {
  return accidentStore.getAccidentsParAnnee;
});

//accidentsParTypeVehicule
const accidentsParTypeVehicule = computed(() => {
  return accidentStore.getAccidentsParTypeVehicule;
});

const accidentsParHeure = computed(() => {
  return accidentStore.getAccidentsParHeure;
});

const accidentsParJourSemaine = computed(() => {
  return accidentStore.getAccidentsParJourSemaine;
});

onMounted(async () => {
  await accidentStore.fetchAccidents();
});
</script>

<template>
  <div>
    <div id="tableau1" class="contient-tableau1">
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
              <td>{{ totalAccidents.totalMorts }}</td>
              <td>{{ totalAccidents.totalBlessesGraves }}</td>
              <td>{{ totalAccidents.totalBlessesLegers }}</td>
              <td>{{ totalAccidents.totalVehiculesImpliques }}</td>
              <td>{{ totalAccidents.totalVictimesImpliques }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="tableau2" class="contient-tableau2">
      <div>
        <h1>Accidents par année</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th v-for="(value, year) in accidentsParAnnee" :key="year">{{ year }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nb d'accidents</td>
              <td v-for="(value, year) in accidentsParAnnee" :key="year">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="tableau3" class="contient-tableau2">
      <h1>Accidents par type de véhicule</h1>
      <table>
        <thead>
          <tr>
            <th>Type de véhicule</th>
            <th>Nb d'accidents</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, type) in accidentsParTypeVehicule[0]" v-if="type !== '_id'" :key="type">
            <td>{{ type }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="tableau4" class="contient-tableau2">
      <h1>Accidents par heure de la journée</h1>
      <table>
        <thead>
          <tr>
            <th>Heure de la journée</th>
            <th>Nb d'accidents</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, temps) in accidentsParHeure" :key="temps">
            <td>{{ temps }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="tableau5" class="contient-tableau2">
      <h1>Accidents par jour de la semaine</h1>
      <table>
        <thead>
          <tr>
            <th>Jour de la semaine</th>
            <th>Nb d'accidents</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, jour) in accidentsParJourSemaine" :key="jour">
            <td>{{ jour }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div id="tableau6" class="contient-tableau2">
      <h1>Accidents par condition météorologique</h1>
      <table>
        <thead>
          <tr>
            <th>Condition météorologique</th>
            <th>Nb d'accidents</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, condition) in accidentsParMeteo" :key="condition">
            <td>{{ condition }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2>MAP</h2>
      <MyMap />
    </div>
  </div>
</template>

<style scoped>
.contient-tableau1 {
  margin-top: 20px;
}
.contient-tableau1 table {
  margin-bottom: 20px;
  border: 1px solid black;
  width: 100%;
}
.contient-tableau1 th,
.contient-tableau1 td {
  padding: 8px;
  text-align: center;
}
.contient-tableau2 {
  margin-top: 20px;
}

.contient-tableau2 table {
  margin-bottom: 20px;
  border: 1px solid black;
  width: 100%;
}

.contient-tableau2 th,
.contient-tableau2 td {
  padding: 8px;
}
</style>
