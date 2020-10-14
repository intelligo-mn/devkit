import { Component, Input } from "@angular/core";
import { ChartOptions } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { BaseChartComponent } from "../base-chart.component";

@Component({
  selector: "dev-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent extends BaseChartComponent {
  @Input() data: Array<any>;

  plugins = [pluginDataLabels];

  constructor() {
    super(["backgroundColor"], true);
  }

  createdOptions(): ChartOptions {
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: true,
          color: "white",
          // anchor: 'center',
          // align: 'end'
        },
      },
      legend: {
        position: "right",
      },
    };
    return options;
  }

  init() {
    if (this.colors.length <= 0 && this.data) {
      const labels: Array<string> = this.data
        .filter((data) => data[this.key])
        .map((data) => data[this.key]);

      this.updateColors(labels);
    }
  }
}
