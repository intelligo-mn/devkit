import { NgModule } from "@angular/core";
import { BarChartHorizontalComponent } from "./bar-horizontal-chart/bar-horizontal-chart.component";
import { BarVerticalChartComponent } from "./bar-vertical-chart/bar-vertical-chart.component";
import { LineAreaChartComponent } from "./line-area-chart/line-area-chart.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";

@NgModule({
  declarations: [
    BarChartHorizontalComponent,
    BarVerticalChartComponent,
    LineAreaChartComponent,
    PieChartComponent
  ],
  imports: [],
  exports: [
    BarChartHorizontalComponent,
    BarVerticalChartComponent,
    LineAreaChartComponent,
    PieChartComponent
  ]
})
export class ChartsModule {}
