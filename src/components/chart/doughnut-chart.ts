import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { Doughnut, mixins } from "vue-chartjs";
// import Chart from "chart.js";

@Component({})
export default class DoughnutChart extends Mixins(Doughnut, mixins.reactiveProp) {
  // @Prop() public chartData!: Chart.ChartData;
  // public chartOptions: Chart.ChartOptions = {
  //   cutoutPercentage: 50
  // };
  mounted() {
    // Will enable this later
    // this.renderChart(this.chartData, this.chartOptions);
    this.renderChart(
      {
        labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [40, 20, 80, 10]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
}
