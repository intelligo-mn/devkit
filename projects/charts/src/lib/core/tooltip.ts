import { Injectable } from "@angular/core";
import { ChartData, ChartTickFormatEnum } from "./chart.model";
import { format } from "d3-format";
import { select, event } from "d3-selection";

export interface IChartTooltip {
  showBarTooltip(data: ChartData, tickFormat?: ChartTickFormatEnum): void;
  hideTooltip(): void;
}

@Injectable({ providedIn: "root" })
export class ChartTooltip implements IChartTooltip {
  public tooltip = select("body")
    .append("div")
    .attr("class", "qms-d3-tooltip") as any; // TODO: Strongly type

  showBarTooltip(data: ChartData, tickFormat?: ChartTickFormatEnum): void {
    this.tooltip
      .style("left", event.pageX - 50 + "px")
      .style("top", event.pageY - 70 + "px")
      .style("display", "inline-block")
      .html(this.getBarTipData(data, tickFormat));
  }

  hideTooltip(): void {
    this.tooltip.style("display", "none");
  }

  private getBarTipData(
    data: ChartData,
    tickFormat?: ChartTickFormatEnum
  ): string {
    let value = data.value;

    if (tickFormat) {
      switch (tickFormat.toLocaleLowerCase()) {
        case ChartTickFormatEnum.Percentage:
          value = (value as number) * 100 + "%";
          break;
        case ChartTickFormatEnum.Minutes:
          break;
      }
    }

    return data.key ? data.key + "</br>" + value.toString() : value.toString();
  }
}
