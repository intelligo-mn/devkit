export interface ChartConfig {
  height: number;
  data: ChartData[];
}

export interface ChartData {
  key: string | number;
  value: string | number;
  data: ChartData[];
}

export enum ChartTickFormatEnum {
  None = 'none',
  Percentage = 'percentage',
  Minutes = 'minutes'
}

