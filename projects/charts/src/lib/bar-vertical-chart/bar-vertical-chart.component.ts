import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  OnChanges,
  EventEmitter,
  Output,
  HostListener
} from '@angular/core';
import { BarVerticalChartBuilder } from './bar-vertical-chart.builder';
import { IBarVerticalChartConfig } from './bar-vertical-chart.model';
import { ChartData } from '../core/chart.model';

@Component({
  selector: 'qms-bar-vertical-chart',
  templateUrl: './bar-vertical-chart.component.html',
  providers: [
    BarVerticalChartBuilder
  ],
  styleUrls: ["./bar-vertical-chart.component.scss"]
})
export class BarVerticalChartComponent implements OnChanges {
  @Input() config: IBarVerticalChartConfig;
  @ViewChild('chart') chartElm: ElementRef;
  @Output() barClicked: EventEmitter<ChartData> = new EventEmitter();

  private resizeWindowTimeout: any;

  constructor(
    private chartBuilder: BarVerticalChartBuilder
  ) {
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
  @HostListener('window:resize')
  onResize() {
    const self = this;
    clearTimeout(this.resizeWindowTimeout);
    this.resizeWindowTimeout = setTimeout(() => {
      self.buildChart();
    }, 300);
  }
}
