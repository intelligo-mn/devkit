import { Component, Input } from "@angular/core";
import { ChartOptions } from "chart.js";
import { BaseChartComponent } from "../base-chart.component";

@Component({
  selector: "dev-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent extends BaseChartComponent {
  @Input() datasets: Array<any>;

  @Input() elementOption;
  @Input() datalabelVisible: boolean;

  options: ChartOptions;

  constructor() {
    super(["borderColor", "pointBackgroundColor"]);
    this.datalabelVisible = true;
    this.datasets = new Array();
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
          display: this.datalabelVisible,
        },
        tooltips: {
          position: "nearest",
        },
      },

      elements: {
        line: { fill: false },
        point: {
          radius: 1,
        },
      },
    };
    return options;
  }

  init() {
    this.options.plugins.datalabels.display = this.datalabelVisible;

    if (this.elementOption) {
      this.options = this.elementOption;
    }

    if (this.colors.length <= 0 && this.datasets) {
      const labels: Array<string> = this.datasets
        .filter((data) => data[this.key])
        .map((data) => data[this.key]);

      this.updateColors(labels);
    }
  }
}
