import { defineStore } from "pinia";
import axios from "axios";

const getAllAccidentsUrl = "http://127.0.0.1:3004/accidents";
const getMaxMortUrl = "http://127.0.0.1:3004/municipalite-max-morts";

export const useAccidentStore = defineStore("accidentStore", {
  state: () => ({
    totalAccidents: {},
    accidentsPerYear: {},
  }),

  getters: {
    getTotalAccidents(state) {
      return state.totalAccidents;
    },
    getAccidentsPerYear(state) {
      return state.accidentsPerYear;
    },
  },

  actions: {
    setTotalAccidents(totalAccidents) {
      this.totalAccidents = totalAccidents;
    },
    setAccidentsPerYear(accidentsPerYear) {
      this.accidentsPerYear = accidentsPerYear;
    },

    async fetchAccidents() {
      try {
        const response = await axios.get(getAllAccidentsUrl);
        console.log(response);

        if (response.status == 200) {
          this.setTotalAccidents(response.data.totalAccidents);
          this.setAccidentsPerYear(response.data.accidentsPerYear);
        }
      } catch (error) {
        console.log(error);
        alert("Une erreur s'est produite. Veuillez réessayer...");
      }
    },
  },
});
