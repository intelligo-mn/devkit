import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";
import { ChartColor } from "chart.js";

@Component({
  selector: "dev-sankey-chart",
  template: `<svg id="sankey"></svg>`,
  styleUrls: ["./sankey-chart.component.scss"],
})
export class SankeyChartComponent implements OnChanges, AfterViewInit {
  @Input() width: number;
  @Input() height: number;
  @Input() dataset: SankeyDataset;
  colors: ChartColor;
  svg: any;
  link: any;
  node: any;

  constructor() {
    this.createChart();
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataset) {
      this.dataset = changes.dataset.currentValue;

      this.createChart();
      this.drawChart();
    }
  }

  private createChart() {
    
    this.svg = d3
      .select("#sankey")
      .attr("width", this.width)
      .attr("height", this.height);

    this.link = this.svg
      .append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("path");

    this.node = this.svg
      .append("g")
      .attr("class", "nodes")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("g");
  }

  private drawChart() {
    d3.selectAll("#sankey > g > *").remove()
    let formatNumber = d3.format(",.0f"),
      format = (d: any) => {
        return formatNumber(d);
      },
      color = d3.scaleOrdinal(d3.schemeCategory10);
    let sankey = d3Sankey
      .sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [this.width - 1, this.height - 6],
      ]);

    sankey(this.dataset);

    this.link = this.link
      .data(this.dataset.links)
      .enter()
      .append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", (d: any) => {
        return Math.max(1, d.width);
      });

    this.link.append("title").text((d: any) => {
      return d.source.name + " → " + d.target.name + "\n" + format(d.value);
    });

    this.link.append("color");

    this.node = this.node.data(this.dataset.nodes).enter().append("g");

    this.node
      .append("rect")
      .attr("x", (d: any) => {
        return d.x0;
      })
      .attr("y", (d: any) => {
        return d.y0;
      })
      .attr("height", (d: any) => {
        return d.y1 - d.y0;
      })
      .attr("width", (d: any) => {
        return d.x1 - d.x0;
      })
      .attr("fill", (d: any) => {
        return color(d.name.replace(/ .*/, ""));
      })
      .attr("stroke", "#000");

    this.node
      .append("text")
      .attr("x", (d: any) => {
        return d.x0 - 6;
      })
      .attr("y", (d: any) => {
        return (d.y1 + d.y0) / 2;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d: any) => {
        return d.name;
      })
      .filter((d: any) => {
        return d.x0 < this.width / 2;
      })
      .attr("x", (d: any) => {
        return d.x1 + 6;
      })
      .attr("text-anchor", "start");

    this.node.append("title").text((d: any) => {
      return d.name + "\n" + format(d.value);
    });
  }

  private color(node, depth) {
    if (depth > 1) return "#000000";
    let id = node.id;
    if (this.colors[id]) {
      return this.colors[id];
    } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
      return this.color(node.targetLinks[0].source, depth - 1);
    } else {
      return null;
    }
  }
}

export interface SNodeExtra {
  id: string;
  name: string;
}

export interface SLinkExtra {
  source: number | string;
  target: number | string;
  value: number;
}
type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

export interface SankeyDataset {
  nodes: SNode[];
  links: SLink[];
}
