import { ChartConfig } from '../core/chart.model';

export interface ILineAreaChartConfig extends ChartConfig  {
  domainMax: number;
  isArea: boolean;
  enableEffects: boolean;
  numberOfTicks: number;
  hideGrid?: boolean;
  hideAxis?: boolean;
}
