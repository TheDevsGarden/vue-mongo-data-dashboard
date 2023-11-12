import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// //Requete GEOJSON for map

// export default {
//   name: "MapComponent",

//   data() {
//     return {
//       map: null,

//       marker: null,
//     };
//   },

//   methods: {
//     getGeoJSONData() {
//       fetch("https://donnees.montreal.ca/dataset/cd722e22-376b-4b89-9bc2-7c7ab317ef6b/resource/3957364a-f579-4bc4-987a-299708fefd3e/download/collisions_routieres.geojson")
//         .then((response) => response.json())

//         .then((data) => this.processData(data))

//         .catch((error) => console.error(error));
//     },

//     processData(geoJSON) {
//       // Note: This is a basic example of processing. You'll need to replace this with

//       // your own logic for determining the coordinates with the most accidents.

//       let counts = {};

//       for (let feature of geoJSON.features) {
//         let coords = feature.geometry.coordinates;

//         let key = `${coords[0]},${coords[1]}`;

//         if (counts[key]) {
//           counts[key]++;
//         } else {
//           counts[key] = 1;
//         }
//       }

//       let mostAccidents = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

//       this.updateMap(mostAccidents[0].split(",").map((coord) => parseFloat(coord)));
//     },

//     updateMap(coordinates) {
//       // Assuming you have the Google Map instance stored in this.map.

//       if (this.marker) {
//         this.marker.setMap(null); // Remove the old marker, if it exists.
//       }

//       this.marker = new google.maps.Marker({
//         position: { lat: coordinates[1], lng: coordinates[0] },

//         map: this.map,
//       });
//     },
//   },

//   mounted() {
//     this.getGeoJSONData();
//   },
// };

app.mount("#app");
//npm install vue-chartjs chart.js --save
