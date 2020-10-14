import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "dev-treemap-chart",
  template: "",
  styleUrls: ["./treemap-chart.component.scss"],
})
export class TreemapChartComponent implements OnChanges, OnInit {
  @Input() data: ITreeMapData;

  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  colorScale; // D3 color provider
  margin;
  width;
  height;
  viewBoxWidth = 1000; // 800; // configurar
  viewBoxHeight = 400; // 620;  // altura do viewport

  duration = 1000;

  treemap;
  root;
  color;
  colorFont;
  opacity;

  constructor(private elRef: ElementRef) {
    this.createChart();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.root = d3
        .hierarchy(changes.data.currentValue)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);
      this.draw();
    }
  }

  private createChart() {
    this.hostElement = this.elRef.nativeElement;
    (this.margin = { top: 0, right: 0, bottom: 0, left: 0 }),
      (this.width = this.viewBoxWidth - this.margin.left - this.margin.right),
      (this.height = this.viewBoxHeight - this.margin.top - this.margin.bottom);

    this.treemap = d3
      .treemap()
      .size([this.width, this.height])
      .paddingTop(28)
      .paddingInner(3); // Padding between each rectangle
    // .paddingOuter(6)
    // .padding(20)

    this.svg = d3
      .select(this.hostElement)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("preserveAspectRatio", "xMidYMid meet")
      // .classed('svg-content', true)
      .attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxHeight)
      .attr("id", "d3-plot")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    // prepare a color scale
    this.color = d3
      .scaleOrdinal()
      .domain(["Blue Group", "Green Group", "Red Group"])
      .range(["blue", "green", "red"]);

    // prepare a color scale
    this.colorFont = d3
      .scaleOrdinal()
      .domain(["Promotores", "Passivos", "Detratores"])
      .range(["white", "white", "white"]);

    // And a opacity scale
    this.opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);
  }

  private draw() {
    const leaves = this.treemap(this.root).leaves();

    const rects = this.svg.selectAll(".leaf").data(leaves, (d) => d.data.id);

    // exit
    rects
      .exit()
      .style("opacity", (d) => this.opacity(d.data.value))
      .transition()
      .duration(this.duration)
      .style("opacity", 1e-6)
      .remove();

    // update
    rects
      .transition()
      .duration(this.duration)
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
      .select("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("opacity", (d) => this.opacity(d.data.value));

    rects.select("title").text((d) => `${d.data.name}\n${d.value}`);

    rects
      .selectAll("tspan")
      .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(d.value))
      .join("tspan")
      .text((d) => d);

    // enter
    const rect = rects
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
      .attr("class", "leaf");

    rect.append("title").text((d) => `${d.data.name}\n${d.value}`);

    rect.select("title").text((d) => `${d.data.name}\n${d.value}`);

    rect
      .append("rect")
      .attr("id", (d, i) => (d.leafUid = "leaf-" + i))
      .style("fill", (d) => this.color(d.parent.data.name))
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("opacity", 1e-6)
      .transition()
      .duration(this.duration)
      .style("opacity", (d) => this.opacity(d.data.value));

    rect
      .append("clipPath")
      .attr("id", (d, i) => (d.clipUid = "clip-" + i))
      .append("use")
      .attr("href", (d) => "#" + d.leafUid);

    rect
      .append("text")
      .attr("clip-path", (d) => "url(#" + d.clipUid + ")")
      .selectAll("tspan")
      .data((d) => {
        const ret = d.data.name
          .split(/(?=[A-Z][a-z])|\s+/g)
          .concat(d.value)
          .map((m) => {
            const output = {} as any;
            output.value = m;
            output.color = this.colorFont(d.parent.data.name);
            return output;
          });
        return ret;
      })
      .join("tspan")
      .attr("x", "0.5em")
      .attr("y", (d, i, nodes) => `${1.4 + i * 1.0}em`)
      .attr("fill-opacity", (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null
      )
      .text((d) => d.value)
      .style("font", "12px Roboto-Regular")
      .attr("fill", (d) => d.color);

    // titles

    const titles = this.svg
      .selectAll(".title")
      .data(this.root.descendants().filter((d) => d.depth === 1));

    // exit
    titles
      .exit()
      .style("opacity", (d) => this.opacity(d.data.value))
      .transition()
      .duration(this.duration)
      .style("opacity", 1e-6)
      .remove();

    // enter
    titles
      .enter()
      .append("text")
      .attr("class", "title")
      .style("font", "19px Roboto-Bold")
      .attr("fill", "#757575")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 + 21)
      .text((d) => d.data.name);

    // update
    titles
      .transition()
      .duration(this.duration)
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 + 21);
  }
}

export interface ITreeMapData {
  id?: number;
  name?: string;
  children?: ITreeMapDataChild[];
}

export interface ITreeMapDataChild {
  id?: number;
  name?: string;
  value?: number;
  children?: ITreeMapDataChild[];
}
