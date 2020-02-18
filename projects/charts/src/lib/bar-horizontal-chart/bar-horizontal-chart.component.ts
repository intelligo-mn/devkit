import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  EventEmitter,
  Output,
  HostListener
} from "@angular/core";
import { BarHorizontalChartBuilder } from "../core/bar-horizontal-chart.builder";
import { IBarHorizontalChartConfig } from "./bar-horizontal-chart.model";
import { ChartData } from "../core/chart.model";

@Component({
  selector: "qms-bar-horizontal-chart",
  templateUrl: "./bar-horizontal-chart.component.html",
  providers: [BarHorizontalChartBuilder],
  styleUrls: ["./bar-horizontal-chart.component.scss"]
})
export class BarChartHorizontalComponent implements OnChanges {
  @Input() config: IBarHorizontalChartConfig;
  @ViewChild("chart") chartElm: ElementRef;
  @Output() barClicked: EventEmitter<ChartData> = new EventEmitter();

  private resizeWindowTimeout: any;

  constructor(private chartBuilder: BarHorizontalChartBuilder) {
    this.chartBuilder.barClicked$.subscribe(data => {
      this.barClicked.emit(data);
    });
  }

  ngOnChanges() {
    this.buildChart();
  }

  buildChart(): void {
    if (this.config && this.config.data && this.config.data.length > 0) {
      this.chartBuilder.buildChart(this.chartElm, this.config);
    }
  }

  /**
   * Opting against fromEvent due to incompatibility with rxjs 5 => 6
   */
  @HostListener("window:resize")
  onResize() {
    const self = this;
    clearTimeout(this.resizeWindowTimeout);
    this.resizeWindowTimeout = setTimeout(() => {
      self.buildChart();
    }, 300);
  }
}
