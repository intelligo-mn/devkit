import { axisBottom, axisLeft } from "d3-axis";
import { selection, BaseType, Selection } from "d3-selection";
import { format } from "d3-format";
import { ChartTickFormatEnum } from "./chart.model";
import { Injectable } from "@angular/core";

export interface IChartAxisConfig {
  svg: Selection<BaseType, {}, HTMLElement, any>;
  height: number;
  xScale: any;
  yScale: any;
  numberOfTicks: number;
  yFormat?: ChartTickFormatEnum;
  xFormat?: ChartTickFormatEnum;
  hideYAxis?: boolean;
  hideXAxis?: boolean;
}
@Injectable({ providedIn: "root" })
export class ChartAxis {
  drawAxis(config: IChartAxisConfig): void {
    if (!config.hideXAxis) {
      this.drawXAxis(config);
    }
    if (!config.hideYAxis) {
      this.drawYAxis(config);
    }
  }

  private drawYAxis(config: IChartAxisConfig) {
    const yAxis = axisLeft(config.yScale).ticks(config.numberOfTicks);

    if (config.yFormat) {
      switch (config.yFormat.toLocaleLowerCase()) {
        case ChartTickFormatEnum.Percentage:
          yAxis.tickFormat(format(".0%"));
          break;
        case ChartTickFormatEnum.Minutes:
          yAxis.tickFormat(d => d + "m");
          break;
      }
    }

    config.svg
      .append("g")
      .attr("class", "qms-y-axis")
      .call(yAxis);
  }

  private drawXAxis(config: IChartAxisConfig) {
    const xAxis = axisBottom(config.xScale).ticks(config.numberOfTicks);

    if (config.xFormat) {
      switch (config.xFormat.toLocaleLowerCase()) {
        case ChartTickFormatEnum.Percentage:
          xAxis.tickFormat(format(".0%"));
          break;
        case ChartTickFormatEnum.Minutes:
          xAxis.tickFormat(d => d + "m");
          break;
      }
    }

    config.svg
      .append("g")
      .attr("class", "qms-x-axis")
      .attr("transform", "translate(0," + config.height + ")")
      .call(xAxis);
  }
}
