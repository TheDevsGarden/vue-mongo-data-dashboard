<template>
  <div id="map"></div>
</template>

<script>
import { useAccidentStore } from "../stores/accidentStore";
// import { useAccidentStore } from "@/stores/accidentStore";

export default {
  async mounted() {
    const accidentStore = useAccidentStore();
    await accidentStore.fetchMunicipaliteMaxMorts();
    const data = accidentStore.getMunicipaliteMaxMorts;

    const map = new google.maps.Map(this.$el, {
      zoom: 10,
      center: { lat: 45.5017, lng: -73.5673 },
    });

    // Create a circle for the accident location
    const accidentCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: { lat: data.pointMoyen.latitude, lng: data.pointMoyen.longitude },
      radius: Math.sqrt(data.totalMorts) * 100, // Adjust the radius based on the number of deaths
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `Le nombre de morts à cet endroit est: ${data.totalMorts}`,
    });

    // Add event listener for the circle instead of the marker
    accidentCircle.addListener("mouseover", function () {
      infoWindow.setPosition(accidentCircle.getCenter());
      infoWindow.open(map);
    });

    accidentCircle.addListener("mouseout", function () {
      infoWindow.close();
    });
  },
};
</script>

<style scoped>
#map {
  height: 400px;

  width: 100%;
}
</style>
