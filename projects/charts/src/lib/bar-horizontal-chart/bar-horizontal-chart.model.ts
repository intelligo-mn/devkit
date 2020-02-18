import { ChartConfig, ChartData, ChartTickFormatEnum } from '../core/chart.model';

export interface IBarHorizontalChartConfig extends ChartConfig {
  domainMax: number;
  numberOfTicks: number;
  isStacked: boolean;
  thresholds: ChartData[];
  tickFormat?: ChartTickFormatEnum;
  hideGrid?: boolean;
  hideAxis?: boolean;
  spreadColorsPerGroup?: boolean;
  colorOverride?: IBarHorizontalChartColorConfig;
}

export interface IBarHorizontalChartColorConfig {
  colors: string[];
}
