import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AreaChartComponent } from "./area-chart/area-chart.component";
import { ChartsModule } from "ng2-charts";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { ColumnChartComponent } from "./column-chart/column-chart.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { SankeyChartComponent } from "./sankey-chart/sankey-chart.component";
import { TreemapChartComponent } from "./treemap-chart/treemap-chart.component";

@NgModule({
  imports: [CommonModule, ChartsModule],
  declarations: [
    AreaChartComponent,
    PieChartComponent,
    BarChartComponent,
    ColumnChartComponent,
    LineChartComponent,
    SankeyChartComponent,
    TreemapChartComponent,
  ],
  exports: [
    ChartsModule,
    AreaChartComponent,
    PieChartComponent,
    BarChartComponent,
    ColumnChartComponent,
    LineChartComponent,
    SankeyChartComponent,
    TreemapChartComponent,
  ],
})
export class DSChartsModule {}
