<template>
  <div>
    <line-chart :chart-data="datacollection" :options="options" ref="canvas"></line-chart>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Line } from "vue-chart-3";
import { useAccidentStore } from "../stores/accidentStore";

export default defineComponent({
  components: {
    Line,
  },
  data() {
    return {
      datacollection: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async mounted() {
    const accidentStore = useAccidentStore();
    await accidentStore.fetchAccidents();
    const accidentsPerYear = accidentStore.getAccidentsPerYear();

    const gradient = this.$refs.canvas.$el.getContext("2d").createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, "rgba(248, 121, 121, 0.5)");
    gradient.addColorStop(1, "rgba(248, 121, 121, 0)");

    this.datacollection = {
      labels: Object.keys(accidentsPerYear),
      datasets: [
        {
          label: "Accidents",
          backgroundColor: gradient,
          data: Object.values(accidentsPerYear),
          fill: "start",
        },
      ],
    };
  },
});
</script>
