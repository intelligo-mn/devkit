import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  EventEmitter,
  Output,
  HostListener
} from '@angular/core';

import { ILineAreaChartConfig } from './line-area-chart.model';
import { LineAreaChartBuilder } from './line-area-chart.builder';
import { ChartData } from '../core/chart.model';

@Component({
  selector: 'qms-line-area-chart',
  templateUrl: './line-area-chart.component.html',
  providers: [
    LineAreaChartBuilder
  ],
  styleUrls: ["./line-area-chart.component.scss"]
})
export class LineAreaChartComponent implements OnChanges {
  @Input() config: ILineAreaChartConfig;
  @ViewChild('chart') chartElm: ElementRef;
  @Output() dotClicked: EventEmitter<ChartData> = new EventEmitter();

  private resizeWindowTimeout: any;

  constructor(
    private chartBuilder: LineAreaChartBuilder
  ) {
    this.chartBuilder.dotClicked$.subscribe(data => {
      this.dotClicked.emit(data);
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
