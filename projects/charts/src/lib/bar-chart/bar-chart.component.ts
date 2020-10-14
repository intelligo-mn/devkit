import { Component, Input } from "@angular/core";
import { ChartOptions } from "chart.js";
import { BaseChartComponent } from "../base-chart.component";

@Component({
  selector: "dev-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"],
})
export class BarChartComponent extends BaseChartComponent {
  @Input() datasets: Array<any>;

  constructor() {
    super();
  }

  createdOptions(): ChartOptions {
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{ ticks: { fontColor: "rgba(47, 53, 80, 0.6)" } }],
        yAxes: [{ ticks: { fontColor: "rgba(47, 53, 80, 0.6)" } }],
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
    };
    return options;
  }

  init() {
    if (this.colors.length <= 0 && this.datasets) {
      const labels: Array<string> = this.datasets
        .filter((data) => data[this.key])
        .map((data) => data[this.key]);

      this.updateColors(labels);
    }
  }
}
