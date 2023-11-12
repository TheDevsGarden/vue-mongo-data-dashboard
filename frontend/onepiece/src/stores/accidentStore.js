import { defineStore } from "pinia";
import axios from "axios";

const getAllAccidentsUrl = "http://127.0.0.1:3004/accidents";
const getMaxMortUrl = "http://127.0.0.1:3004/municipalite-max-morts";

export const useAccidentStore = defineStore("accidentStore", {
  state: () => ({
    totalAccidents: {},
    accidentsParAnnee: {},
    accidentsParTypeVehicule: {},
    accidentsParHeure: {},
    accidentsParJourSemaine: {},
    municipaliteMaxMorts: {},
  }),

  getters: {
    getTotalAccidents(state) {
      return state.totalAccidents;
    },
    getAccidentsParAnnee(state) {
      return state.accidentsParAnnee;
    },
    getMunicipaliteMaxMorts(state) {
      return state.municipaliteMaxMorts;
    },
    getAccidentsParTypeVehicule(state) {
      return state.accidentsParTypeVehicule;
    },
    getAccidentsParHeure(state) {
      return state.accidentsParHeure;
    },
    getAccidentsParJourSemaine(state) {
      return state.accidentsParJourSemaine;
    },
  },

  actions: {
    setTotalAccidents(totalAccidents) {
      this.totalAccidents = totalAccidents;
    },
    setAccidentsParAnnee(accidentsParAnnee) {
      this.accidentsParAnnee = accidentsParAnnee;
    },
    setAccidentsParTypeVehicule(accidentsParTypeVehicule) {
      this.accidentsParTypeVehicule = accidentsParTypeVehicule;
    },
    setAccidentsParHeure(accidentsParHeure) {
      this.accidentsParHeure = accidentsParHeure;
    },

    setAccidentsParJourSemaine(accidentsParJourSemaine) {
      this.accidentsParJourSemaine = accidentsParJourSemaine;
    },

    setMunicipaliteMaxMorts(data) {
      this.municipaliteMaxMorts = data;
    },

    async fetchAccidents() {
      try {
        const response = await axios.get(getAllAccidentsUrl);
        console.log(response);

        if (response.status == 200) {
          this.setTotalAccidents(response.data.totalAccidents);
          this.setAccidentsParAnnee(response.data.accidentsParAnnee);
          this.setAccidentsParTypeVehicule(response.data.accidentsParTypeVehicule);
          this.setAccidentsParHeure(response.data.accidentsParHeure);
          this.setAccidentsParJourSemaine(response.data.accidentsParJourSemaine);
        }
      } catch (error) {
        console.log(error);
        alert("Une erreur s'est produite. Veuillez réessayer...");
      }
    },
    async fetchMunicipaliteMaxMorts() {
      try {
        const response = await axios.get(getMaxMortUrl);

        console.log(response);

        if (response.status === 200) {
          this.setMunicipaliteMaxMorts(response.data);
        }
      } catch (error) {
        console.log(error);

        alert("Une erreur s'est produite. Veuillez réessayer...");
      }
    },
  },
});
