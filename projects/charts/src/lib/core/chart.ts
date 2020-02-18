import { axisBottom, axisLeft } from 'd3-axis';
import { selection, BaseType, Selection } from 'd3-selection';
import { ChartAxis } from './axis';
import { ChartGridConfig } from './grid.builder';
import { ChartConfig, ChartData } from './chart.model';
import { ChartColorService } from './color.service';
import { select } from 'd3-selection';
import { ElementRef, Injectable } from '@angular/core';
import { ChartTransition } from './transition';
import { ChartTooltip } from './tooltip';

@Injectable({ providedIn: "root" })
export class QmsChart {
  margin = { top: 8, right: 16, bottom: 20, left: 40 };
  svg: Selection<BaseType, {}, HTMLElement, any>;
  width = 400;
  height = 400;
  colors = [] as string[];
  startData = [] as any[]; // TODO: Strongly type
  endData = [] as any[]; // TODO: Strongly type

  constructor(
    public axisBuilder: ChartAxis,
    public gridBuilder: ChartGridConfig,
    public transitionService: ChartTransition,
    public tooltipBuilder: ChartTooltip,
    public colorService: ChartColorService
  ) { }

  /**
   * @param chartElm Reference to SVG on dom
   * @param config Chart specific configuration
   */
  initializeChartState(chartElm: ElementRef, config: ChartConfig): void {
    select(chartElm.nativeElement).select('g').remove();
    this.width = chartElm.nativeElement.parentNode.clientWidth - this.margin.left - this.margin.right;
    this.height = config.height;
    this.colors = this.colorService.getColorScale(Math.max(config.data.length, config.data[0].data ? config.data[0].data.length : 0));
  }

  /**
   * @param chartElm Reference to SVG on dom
   * @param center Are we pinning x,y to the top,left, or are we centering our drawing group inside the SVG.
   */
  buildContainer(chartElm: ElementRef, center = false): void {
    const combinedHeight = this.height + this.margin.top + this.margin.bottom;
    const combinedWidth = this.width + this.margin.left + this.margin.right;
    this.svg = select(chartElm.nativeElement)
      .attr('width', combinedWidth)
      .attr('height', combinedHeight);
    if (center) {
      this.svg = this.svg
        .append('g')
        .attr('transform', 'translate(' + combinedWidth / 2 + ',' + combinedHeight / 2 + ')');
      return;
    }
    this.svg = this.svg
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  /**
   * @param chartElm Reference to SVG on dom
   * @param data Generic multi-dimensional ChartData structure
   * @param yScale D3 scale transformation object (d3.ScaleBand)
   */
  setHorizontalMarginsBasedOnContent(chartElm: ElementRef, data: ChartData[], yScale: any): void {
    const axisY = axisLeft(yScale).ticks(5);
    let max = 0;
    select(chartElm.nativeElement).append('g')
      .call(axisY)
      .each((d, i, n: any) => {
        if (n[i].getBBox().width > max) {
          max = n[i].getBBox().width;
        }
      })
      .remove();
    this.margin.left = max;
    this.margin.bottom = this.margin.bottom;
    this.width = this.width - this.margin.left;
  }
}
