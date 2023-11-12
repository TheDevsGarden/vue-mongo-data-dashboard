// // LineChart.js
// import { Line, mixins } from "vue-chartjs";
// const { reactiveProp } = mixins;

// export default {
//   extends: Line,
//   mixins: [reactiveProp],
//   props: ["options"],
//   mounted() {
//     // this.chartData is created in the mixin
//     // this.options is passed in through the props
//     this.renderChart(this.chartData, this.options);
//   },
// };
// // import { defineComponent, onMounted, ref } from "vue";
// // import { Line } from "vue-chart-3";

// // export default defineComponent({
// //   components: {
// //     graphique: Line,
// //   },
// //   setup() {
// //     const data = ref(null);
// //     const options = ref(null);

// //     onMounted(() => {
// //       data.value = {
// //         labels: ["January", "February", "March", "April", "May", "June", "July"],
// //         datasets: [
// //           {
// //             label: "My First dataset",
// //             backgroundColor: "#f87979",
// //             data: [0, 10, 5, 2, 20, 30, 45],
// //           },
// //         ],
// //       };

// //       options.value = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //       };
// //     });

// //     return {
// //       data,
// //       options,
// //     };
// //   },
// // });
