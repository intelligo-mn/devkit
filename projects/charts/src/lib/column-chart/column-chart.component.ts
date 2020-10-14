import { Component, Input } from "@angular/core";
import { ChartOptions } from "chart.js";
import { BaseChartComponent } from "../base-chart.component";

@Component({
  selector: "dev-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.scss"],
})
export class ColumnChartComponent extends BaseChartComponent {
  @Input() datasets: Array<any>;
  @Input() type = "bar";
  @Input() stacked = false;
  @Input() datalabelDisplay: boolean = false;

  constructor() {
    super();
  }

  createdOptions(): ChartOptions {
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: { fontColor: "rgba(47, 53, 80, 0.6)" },
            stacked: this.stacked,
          },
        ],
        yAxes: [
          {
            ticks: { fontColor: "rgba(47, 53, 80, 0.6)" },
            stacked: this.stacked,
          },
        ],
      },
      plugins: {
        datalabels: {
          display: this.datalabelDisplay,
          align: "right",
        },
      },
    };
    return options;
  }

  init() {
    this.options.plugins.datalabels.display = this.datalabelDisplay;

    if (this.colors.length <= 0 && this.datasets) {
      const labels: Array<string> = this.datasets
        .filter((data) => data[this.key])
        .map((data) => data[this.key]);
      this.updateColors(labels);
    }

    if (this.stacked != null) {
      this.options.scales.xAxes[0].stacked = this.stacked;
      this.options.scales.yAxes[0].stacked = this.stacked;
    }
    if (this.datalabelDisplay) {
      this.options.plugins.datalabels.display = this.datalabelDisplay;
    }
  }
}
