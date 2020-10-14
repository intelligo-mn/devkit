export interface IColumnChartData {
  data?: number[];
  label?: string[];
}

export class ColumnChartData implements IColumnChartData {
  constructor(public data?: number[], public label?: string[]) {
    this.data = [];
    this.label = [];
  }
}
