import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { IPieChartConfig } from './pie-chart.model';
import { PieChartBuilder } from './pie-chart.builder';
import { fromEvent, Subscription } from 'rxjs';
import { ChartData } from '../core/chart.model';

@Component({
  selector: 'qms-pie-chart',
  templateUrl: './pie-chart.component.html',
  providers: [
    PieChartBuilder
  ],
  styleUrls: ["./pie-chart.component.scss"]
})
export class PieChartComponent implements OnChanges {
  @Input() config: IPieChartConfig;
  @ViewChild('chart') chartElm: ElementRef;
  @Output() sliceClicked: EventEmitter<ChartData> = new EventEmitter();

  private resizeWindowTimeout: any;

  constructor(
    private chartBuilder: PieChartBuilder
  ) {
    this.chartBuilder.sliceClicked$.subscribe(data => {
      this.sliceClicked.emit(data);
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
