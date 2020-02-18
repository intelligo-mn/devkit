import { Injectable, ElementRef } from '@angular/core';

import { transition } from 'd3-transition';
import { select, selection } from 'd3-selection';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { line, Line, area, Area } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { range } from 'd3-array';

import { Observable, Subject } from 'rxjs';

/**
 * Lib
 */
import { LineAreaChartEffectsBuilder } from './line-area-chart-effects.builders';
import { ILineAreaChartConfig } from './line-area-chart.model';
import { ChartAxis } from '../core/axis';
import { ChartGridConfig } from '../core/grid.builder';
import { ChartTransition } from '../core/transition';
import { ChartTooltip } from '../core/tooltip';
import { ChartColorService } from '../core/color.service';
import { QmsChart } from '../core/chart';
import { ChartData } from '../core/chart.model';

export interface ILineAreaChartBuilder {
  buildChart(chartElm: ElementRef, config: ILineAreaChartConfig): void;
}

@Injectable({ providedIn: "root" })
export class LineAreaChartBuilder extends QmsChart implements ILineAreaChartBuilder {
  private line: Line<[number, number]>;
  private area: Area<[number, number]>;
  private xScale: ScaleLinear<number, number>;
  private yScale: ScaleLinear<number, number>;
  private dotClickedSource = new Subject<ChartData>();
  private originalHeight: number;
  private config: ILineAreaChartConfig;
  dotClicked$ = this.dotClickedSource.asObservable();

  constructor(
    public axisBuilder: ChartAxis,
    public gridBuilder: ChartGridConfig,
    public transitionService: ChartTransition,
    public tooltipBuilder: ChartTooltip,
    public colorService: ChartColorService
  ) {
    super(
      axisBuilder,
      gridBuilder,
      transitionService,
      tooltipBuilder,
      colorService
    );
  }

  buildChart(chartElm: ElementRef, config: ILineAreaChartConfig): void {
    this.config = JSON.parse(JSON.stringify(config));
    this.startData = range(this.config.data[0].data.length).map((d) => {
      return {
        value: 0,
        key: ''
      };
    });
    if (this.config.hideAxis) {
      this.adjustForHiddenAxis();
    }
    this.initializeChartState(chartElm, this.config);
    this.buildScales(this.config);
    this.drawChart(chartElm, this.config);
  }

  private adjustForHiddenAxis() {
    this.config.height = this.config.height + 12;
    this.margin.top = 8;
    this.margin.bottom = 8;
    this.margin.left = 8;
    this.margin.right = 8;
  }

  private buildScales(config: ILineAreaChartConfig): void {
    this.xScale = scaleLinear()
      .domain([0, config.data[0].data.length - 1])
      .range([0, this.width]);

    this.yScale = scaleLinear()
      .domain([0, config.domainMax])
      .range([this.height, 0]);

    this.line = line()
      .x((d, i) => {
        return this.xScale(i);
      })
      .y((d: any) => {
        return this.yScale(d.value);
      });

    this.area = area()
      .x((d, i) => {
        return this.xScale(i);
      })
      .y0(this.height)
      .y1((d: any) => {
        return this.yScale(d.value);
      });
  }

  private drawChart(chartElm: ElementRef, config: ILineAreaChartConfig): void {
    this.buildContainer(chartElm);
    if (!config.hideAxis) {
      this.axisBuilder.drawAxis({
        svg: this.svg,
        numberOfTicks: config.numberOfTicks || 5,
        height: this.height,
        xScale: this.xScale,
        yScale: this.yScale
      });
    }
    if (!config.hideGrid) {
      this.gridBuilder.drawHorizontalGrid({
        svg: this.svg,
        numberOfTicks: config.numberOfTicks || 5,
        width: this.width,
        xScale: this.xScale,
        yScale: this.yScale
      });
    }
    this.drawLineArea(config);
    if (config.enableEffects) {
      this.drawEffects(config);
    }
    this.drawDots(config);
  }

  private drawLineArea(config: ILineAreaChartConfig): void {
    for (let i = 0; i < config.data.length; i++) {
      if (config.isArea) {
        this.drawArea(config.data[i].data, i);
      }
      this.drawLine(config.data[i].data, i);
    }
  }

  private drawLine(lineData: ChartData[], index: number): void {
    this.svg.append('g')
      .attr('class', 'lines')
      .append('path')
      .datum(lineData)
      .attr('class', 'line')
      .attr('d', this.line(this.startData))
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('d', this.line as any) // TODO: strongly type
      .attr('stroke', () => {
        return this.colors[index];
      })
      .attr('fill', 'none');
  }

  private drawArea(lineData: ChartData[], index: number) {
    this.svg.append('g')
      .attr('class', 'areas')
      .append('path')
      .datum(lineData)
      .attr('class', 'area')
      .style('opacity', 0.5)
      .style('fill', () => {
        return this.colors[index];  // TODO: strongly type
      })
      .attr('d', this.line(this.startData))
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('d', this.area as any);  // TODO: strongly type
  }

  private drawEffects(config: ILineAreaChartConfig) {
    if (config.enableEffects) {
      const effectsBuilder = new LineAreaChartEffectsBuilder();
      effectsBuilder.buildEffects({
        svg: this.svg,
        height: this.height,
        width: this.width,
        data: config.data,
        colors: this.colors,
        x: this.xScale,
        y: this.yScale
      });
    }
  }

  private drawDots(config: ILineAreaChartConfig): void {
    const self = this;
    for (let index = 0; index < config.data.length; index++) {
      this.svg.append('g')
        .attr('class', 'dots')
        .selectAll('.dot')
        .data(config.data[index].data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('stroke', (d: ChartData) => {
          return this.colors[index];
        })
        .attr('cx', (d: ChartData, i: number) => {
          return this.xScale(i);
        })
        .attr('cy', (d: ChartData) => {
          return this.yScale(0);
        })
        .attr('fill', '#fff')
        .on('mouseover', function (d: ChartData) {
          self.tooltipBuilder.showBarTooltip(d);
          select(this).transition(transition()
            .duration(self.transitionService.getTransitionDuration() / 3))
            .attr('r', 6)
            .attr('fill', self.colors[index]);
        })
        .on('mouseout', function () {
          self.tooltipBuilder.hideTooltip();
          select(this).transition(transition()
            .duration(self.transitionService.getTransitionDuration() / 3))
            .attr('r', 4)
            .attr('fill', '#fff');
        })
        .on('click', (d: ChartData, i: number) => {
          this.dotClickedSource.next(d);
        })
        .transition(transition()
          .duration(this.transitionService.getTransitionDuration()))
        .attr('cy', (d: ChartData) => {
          return this.yScale(d.value as number);
        })
        .attr('r', 4);
    }
  }
}
