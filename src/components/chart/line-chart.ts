import { Component, Prop, Watch, Mixins, Vue } from "vue-property-decorator";
import { Line, mixins } from "vue-chartjs";
// import Chart from "chart.js";

@Component({})
//export default class LineChart extends Vue<Line> {
export default class LineChart extends Mixins(Line, mixins.reactiveProp) {
  //gradient: any = null;
  // gradient2: any = null;

  mounted() {
    //var g1 = new LinearGradient(0, 0, 0, 450);
    // var g1 = mixins.reactiveData.canvas
    //   .getContext("2d")
    //   .createLinearGradient(0, 0, 0, 450);
    // this.gradient = canva
    //   .getContext("2d")
    //   .createLinearGradient(0, 0, 0, 450);
    // this.gradient2 = Chart.canvas
    //   .getContext("2d")
    //   .createLinearGradient(0, 0, 0, 450);

    // this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    // this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    // this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    // this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    // this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    // this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(
      {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Data One",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            // backgroundColor: this.gradient,
            data: [40, 39, 10, 40, 39, 80, 40]
          },
          {
            label: "Data Two",
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            // backgroundColor: this.gradient2,
            data: [60, 55, 32, 10, 2, 12, 53]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
}
