import { defineStore } from "pinia";
import axios from "axios";

const getAllAccidentsUrl = "http://127.0.0.1:3004/accidents";
const getMaxMortUrl = "http://127.0.0.1:3004/municipalite-max-morts";

export const useAccidentStore = defineStore("accidentStore", {
  state: () => ({
    accidents: [],
  }),

  getters: {
    getAccidents(state) {
      return state.accidents;
    },
  },

  actions: {
    setAccidents(accidents) {
      this.accidents = accidents;
    },

    // setMaxMorts(accidents) {
    //   this.accidents = accidents;
    // },

    async fetchAccidents() {
      try {
        const response = await axios.get(getAllAccidentsUrl);
        console.log(response);

        if (response.status == "200") {
          this.setAccidents(response.data);
        }
      } catch (error) {
        console.log(error);
        alert("Une erreur s'est produite. Veuillez réessayer...");
      }
    },

    // async fetchMaxMorts() {
    //   try {
    //     const response = await axios.get(getMaxMortUrl);
    //     console.log(response);

    //     if (response.status == "200") {
    //       this.setAccidents(response.data);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     alert("Une erreur s'est produite. Veuillez réessayer...");
    //   }
    // },
  },
});
