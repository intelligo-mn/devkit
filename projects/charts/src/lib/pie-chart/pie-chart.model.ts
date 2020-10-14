export interface IPieChartData {
  datas?: number[];
  labels?: string[];
}

export class PieChartData implements IPieChartData {
  constructor(public datas?: number[], public labels?: string[]) {
    this.datas = [];
    this.labels = [];
  }
}
