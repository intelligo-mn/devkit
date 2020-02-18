import { ChartConfig, ChartData, ChartTickFormatEnum } from '../core/chart.model';

export interface IBarVerticalChartConfig extends ChartConfig {
  domainMax: number;
  numberOfTicks: number;
  isStacked: boolean;
  thresholds: ChartData[];
  tickFormat?: ChartTickFormatEnum;
  hideGrid?: boolean;
  hideAxis?: boolean;
  spreadColorsPerGroup?: boolean;
  colorOverride?: IBarVerticalChartColorConfig;
}

export interface IBarVerticalChartColorConfig {
  colors: string[];
}
