import { Input, OnChanges } from "@angular/core";
import { ChartOptions } from "chart.js";
import { Color } from "ng2-charts";
import { ChartColors } from "./colors";

export abstract class BaseChartComponent implements OnChanges {
  @Input() inputColors: Map<string, string>;
  @Input() colorNames: Array<string>;
  @Input() colors: Array<Color>;

  @Input() key: string;
  @Input() labels: Array<string>;

  options: ChartOptions;
  groupColors: boolean;
  stylePropertyNames: Array<string>;

  translate: boolean;

  constructor(
    stylePropertyNames: Array<string> = ["backgroundColor"],
    groupColors: boolean = false
  ) {
    this.key = "label";

    this.stylePropertyNames = stylePropertyNames;

    this.colors = new Array();
    this.inputColors = new Map();
    this.colorNames = new Array();

    this.options = this.createdOptions();
    this.groupColors = groupColors;
  }

  abstract createdOptions(): ChartOptions;

  ngOnChanges() {
    if (this.colorNames) {
      this.updateColors(this.colorNames);
    }

    this.init();
  }

  abstract init(): void;

  protected updateColors(
    labels: Array<string>,
    fieldNames: Array<string> = this.stylePropertyNames,
    hexColor: boolean = false
  ) {
    if (!labels || labels.length <= 0 || fieldNames.length <= 0) return;

    let colorList: Array<string> = new Array();

    labels.forEach((label) => {
      const data: any = label;

      if (data instanceof Array) {
        label = data.length == 1 ? data[0] : null;
      }

      if (!label) return;

      let color: string = ChartColors[label.toUpperCase()];

      if (!color && this.inputColors) {
        color = this.inputColors.get(label);
      }

      if (!color) return;

      if (hexColor) {
        const [r, g, b] = this.hexToRgb(color);
        color = `rgba(${r}, ${g}, ${b}, 0.6)`;
      }

      colorList.push(color);
    });

    if (colorList.length <= 0) return;

    if (this.groupColors) {
      const color: Color = this.createColor(fieldNames, colorList);
      this.colors = [color];
    } else {
      this.colors = colorList.map((clr) => this.createColor(fieldNames, clr));
    }

    // console.log("update colors: ", this.inputColors, this.colors, this.labels);
  }

  private createColor(
    propertys: Array<string>,
    color: string | Array<string>
  ): Color {
    const result: any = Object.create({});

    propertys.forEach((property) => (result[property] = color));

    return result;
  }

  private hexToRgb(hex) {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));
  }
}
