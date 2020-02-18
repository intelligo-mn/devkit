import { Injectable, ElementRef } from '@angular/core';

import { select, Selection, EnterElement, BaseType } from 'd3-selection';
import { scaleBand, ScaleBand, scaleLinear, ScaleLinear } from 'd3-scale';
import { color } from 'd3-color';
import { transition } from 'd3-transition';

/**
 * Lib
 */
import { IBarVerticalChartConfig } from './bar-vertical-chart.model';
import { ChartAxis } from '../core/axis';
import { ChartGridConfig } from '../core/grid.builder';
import { ChartTransition } from '../core/transition';
import { ChartTooltip } from '../core/tooltip';
import { ChartColorService } from '../core/color.service';
import { QmsChart } from '../core/chart';
import { ChartData, ChartTickFormatEnum } from '../core/chart.model';

import { Subject, Observable } from 'rxjs';

type GroupType = Selection<Element |
  EnterElement |
  Document |
  Window,
  ChartData,
  Element |
  EnterElement |
  Document |
  Window,
  ChartData>;

export interface IBarVerticalChart {
  buildChart(chartElm: ElementRef, config: IBarVerticalChartConfig): void;
}

@Injectable({ providedIn: "root" })
export class BarVerticalChartBuilder extends QmsChart {
  private xScaleStacked: ScaleBand<string>;
  private xScaleGrouped: ScaleBand<string>;
  private yScale: ScaleLinear<number, number>;
  private barClickedSource = new Subject<ChartData>();
  barClicked$ = this.barClickedSource.asObservable();

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

  buildChart(chartElm: ElementRef, config: IBarVerticalChartConfig): void {
    if (config.colorOverride && config.colorOverride.colors) {
      this.colors = config.colorOverride.colors;
    }
    if (config.hideAxis) {
      this.adjustForHiddenAxis(config);
    }
    this.initializeChartState(chartElm, config);
    if (config.colorOverride && config.colorOverride.colors) {
      this.colors = config.colorOverride.colors.reverse();
    }
    this.buildScales(config);
    this.drawChart(chartElm, config);
  }

  private adjustForHiddenAxis(config: IBarVerticalChartConfig) {
    const hasGroupLabel = this.hasGroupLabel(config);

    config.height = config.height + this.margin.top;
    if (!hasGroupLabel) {
      config.height = config.height + this.margin.bottom;
    }
    this.margin.top = 0;
    this.margin.bottom = hasGroupLabel ? this.margin.bottom : 0;
    this.margin.left = 0;
    this.margin.right = 0;
  }

  private hasGroupLabel(config: IBarVerticalChartConfig) {
    let hasGroupLabel = false;
    config.data.forEach(node => {
      if (node.key) {
        hasGroupLabel = true;
      }
    });
    return hasGroupLabel;
  }

  private buildScales(config: IBarVerticalChartConfig) {
    this.yScale = scaleLinear()
      .rangeRound([0, config.height])
      .domain([config.domainMax, 0]);

    this.xScaleStacked = scaleBand()
      .domain(config.data.map((d) => d.key as string))
      .rangeRound([0, this.width])
      .padding(0.1);

    this.xScaleGrouped = scaleBand()
      .padding(0.2)
      .rangeRound([0, this.xScaleStacked.bandwidth()])
      .domain(config.data[0].data.map((d) => d.key as string));
  }

  private drawChart(chartElm: ElementRef, config: IBarVerticalChartConfig): void {
    this.buildContainer(chartElm);
    this.axisBuilder.drawAxis({
      svg: this.svg,
      numberOfTicks: config.numberOfTicks || 5,
      height: this.height,
      xScale: this.xScaleStacked,
      yScale: this.yScale,
      xFormat: ChartTickFormatEnum.None,
      yFormat: config.tickFormat || ChartTickFormatEnum.None,
      hideYAxis: config.hideAxis
    });
    if (!config.hideGrid) {
      this.gridBuilder.drawHorizontalGrid({
        svg: this.svg,
        numberOfTicks: config.numberOfTicks || 5,
        width: this.width,
        xScale: this.xScaleStacked,
        yScale: this.yScale
      });
    }
    this.addGroups(config);
  }

  private addGroups(config: IBarVerticalChartConfig) {
    const groupsContainer = this.svg.append('g')
      .attr('class', 'qms-bars')
      .selectAll('g')
      .data(config.data)
      .enter().append('g')
      .attr('class', 'qms-bar-group')
      .attr('data-group-id', (d: ChartData, i: number) => {
        return i;
      })
      .attr('transform', (d: ChartData, i: number) => {
        return 'translate(' + this.xScaleStacked(d.key as string) + ',0)';
      });

    const group = groupsContainer.selectAll('rect')
      .data((d: ChartData, i: number) => {
        return d.data;
      });

    this.drawBarsPerGroup(group, config);

    // We have no thresholds to draw
    if (!config.thresholds) {
      return;
    }

    // Draw threshold across entire chart
    if (config.thresholds.length === 1 && !config.thresholds[0].data) {
      this.drawThresholdAcrossChart(config);
    }

    // Draw threshold across each group
    if (config.thresholds.length > 1 && (!config.thresholds[0].data || config.isStacked)) {
      this.drawThresholdsPerGroup(group, config);
    }

    // Draw threshold across each bar in group
    if (config.thresholds.length > 1 && config.thresholds[0].data && !config.isStacked) {
      this.drawThresholdsPerBarInGroup(group, config);
    }
  }

  private drawBarsPerGroup(group: GroupType, config: IBarVerticalChartConfig) {
    const self = this;
    group.enter().append('rect')
      .attr('class', 'qms-bar')
      .attr('x', (d: ChartData, i: number) => {

        return !config.isStacked ? this.xScaleGrouped(d.key as string) : this.xScaleStacked(d.key as string);
      })
      .style('fill', (d: ChartData, i: number, n: any) => {
        if (config.spreadColorsPerGroup) {
          const groupIndex = parseInt(n[0].parentNode.getAttribute('data-group-id'), 10);
          return this.colors[groupIndex];
        }
        return this.colors[i];
      })
      .attr('y', () => {
        return this.height;
      })
      .attr('height', 0)
      .on('mouseover', function (d: ChartData, i: number, n: any) {
        select(this).transition(transition()
          .duration(self.transitionService.getTransitionDuration() / 5))
          .style('fill', () => {
            if (config.spreadColorsPerGroup) {
              const groupIndex = parseInt(n[0].parentNode.getAttribute('data-group-id'), 10);
              return color(self.colors[groupIndex]).darker(1).toString();
            }
            return color(self.colors[i]).darker(1).toString();
          });
      })
      .on('mousemove', function (d: ChartData, i: number) {
        self.tooltipBuilder.showBarTooltip(d, config.tickFormat || ChartTickFormatEnum.None);
      })
      .on('mouseout', function (d: ChartData, i: number, n: any) {
        self.tooltipBuilder.hideTooltip();
        select(this).transition(transition()
          .duration(self.transitionService.getTransitionDuration() / 5))
          .style('fill', () => {
            if (config.spreadColorsPerGroup) {
              const groupIndex = parseInt(n[0].parentNode.getAttribute('data-group-id'), 10);
              return self.colors[groupIndex];
            }
            return self.colors[i];
          });
      })
      .on('click', (d: ChartData, i: number) => {
        this.barClickedSource.next(d);
      })
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('width', !config.isStacked ? this.xScaleGrouped.bandwidth() : this.xScaleStacked.bandwidth())
      .attr('y', (d: ChartData) => {
        return this.yScale(d.value as number);
      })
      .attr('height', (d: ChartData) => {
        return this.height - this.yScale(d.value as number);
      });
  }

  private drawThresholdAcrossChart(config: IBarVerticalChartConfig) {
    this.applyPreTransitionThresholdStyles(this.svg.select('.qms-bars').append('rect'), config)
      .attr('width', this.width)
      .on('mousemove', (d: ChartData, i: number) => {
        this.tooltipBuilder.showBarTooltip(config.thresholds[i], config.tickFormat || ChartTickFormatEnum.None);
      })
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('y', (d: ChartData, i: number) => {
        return this.yScale(config.thresholds[i].value as number);
      });
  }

  private drawThresholdsPerGroup(group: GroupType, config: IBarVerticalChartConfig) {
    this.applyPreTransitionThresholdStyles(this.svg.selectAll('.qms-bar-group').append('rect'), config)
      .attr('width', this.xScaleStacked.bandwidth())
      .on('mousemove', (d: ChartData, i: number) => {
        this.tooltipBuilder.showBarTooltip(config.isStacked ?
          config.thresholds[i].data[0] :
          config.thresholds[i],
          config.tickFormat || ChartTickFormatEnum.None
        );
      })
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('y', (d: ChartData, i: number) => {
        return this.yScale(config.isStacked ? config.thresholds[i].data[0].value as number : config.thresholds[i].value as number);
      });
  }

  private drawThresholdsPerBarInGroup(group: GroupType, config: IBarVerticalChartConfig) {
    this.applyPreTransitionThresholdStyles(group.enter().append('rect'), config)
      .on('mousemove', (d: ChartData, i: number, n: any) => {
        this.tooltipBuilder.showBarTooltip(
          config.thresholds[n[0].parentElement.dataset['groupId']].data[i],
          config.tickFormat || ChartTickFormatEnum.None
        );
      })
      .attr('width', this.xScaleGrouped.bandwidth())
      .transition(transition()
        .duration(this.transitionService.getTransitionDuration()))
      .attr('y', (d: ChartData, i: number, n: any) => {
        return this.yScale(config.thresholds[n[0].parentElement.dataset['groupId']].data[i].value as number);
      });
  }

  private applyPreTransitionThresholdStyles(elm: Selection<BaseType, {}, HTMLElement, any> | any, config: IBarVerticalChartConfig) {
    return elm.attr('class', 'qms-threshold')
      .attr('x', (d: ChartData) => {
        return this.xScaleGrouped(d ? d.key as string : '');
      })
      .attr('y', () => {
        return this.height;
      })
      .attr('height', 0)
      .style('fill', () => {
        return this.colorService.getAlert();
      })
      .style('stroke', () => {
        return this.colorService.getAlert();
      })
      .style('stroke-width', () => {
        return 2;
      })
      .on('mouseout', () => {
        this.tooltipBuilder.hideTooltip();
      })
      .attr('height', () => {
        return '3px';
      });
  }
}
