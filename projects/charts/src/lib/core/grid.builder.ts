import { axisBottom, axisLeft } from "d3-axis";
import { selection, BaseType, Selection } from "d3-selection";
import { Injectable } from "@angular/core";

export interface IChartGridConfig {
  svg: Selection<BaseType, {}, HTMLElement, any>;
  /**
   * Required for horizontal grid
   */
  width?: number;
  /**
   * Required for vertical grid
   */
  height?: number;
  xScale: any;
  yScale: any;
  numberOfTicks: number;
}
@Injectable({ providedIn: "root" })
export class ChartGridConfig {
  drawVerticalGrid(config: IChartGridConfig): void {
    config.svg
      .append("g")
      .attr("class", "qms-grid")
      .selectAll("g.rule")
      .data(config.xScale.ticks(5))
      .enter()
      .append("svg:g")
      .attr("class", "qms-grid-rule")
      .attr("transform", (d: number) => `translate(${config.xScale(d)}, 0)`)
      .append("svg:line")
      .attr("y1", 0)
      .attr("y2", config.height)
      .attr("class", (d, i: number) => (i === 0 ? "qms-grid-rule-last" : ""));
  }

  drawHorizontalGrid(config: IChartGridConfig): void {
    config.svg
      .append("g")
      .attr("class", "qms-grid")
      .selectAll("g.qms-grid-rule")
      .data(config.yScale.ticks(config.numberOfTicks))
      .enter()
      .append("svg:g")
      .attr("class", "qms-grid-rule")
      .append("svg:line")
      .attr("y1", (d: number) => config.yScale(d))
      .attr("y2", (d: number) => config.yScale(d))
      .attr("x1", 0)
      .attr("x2", config.width)
      .attr("class", (d: number, i: number) =>
        i === 0 ? "qms-grid-rule-last" : ""
      );
  }
}
