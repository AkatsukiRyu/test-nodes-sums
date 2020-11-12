import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import * as d3 from 'd3';
import { SequenceDiagramData } from '../models/sequence-diagram.model';
import { SequenceDiagramHelper } from './sequence-diagrams.helper';

@Component({
  selector: 'yfiles-sequence-diagram',
  templateUrl: './sequence-diagram.component.html',
  styleUrls: ['./sequence-diagram.component.scss'],
})
export class SequenceDiagramComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('sequenceDiagram', { static: false })
  public element: ElementRef;
  @ViewChild('sequenceContainer', { static: false })
  public container: ElementRef;

  @Input() public sequenceDiagram: SequenceDiagramData;
  @Input() public forceClose: boolean;

  private _classes = [];
  private _operations = [];
  private _edges = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes) {
      return;
    }

    if (changes.sequenceDiagram && this.sequenceDiagram) {
      this.prepareData();
    }

    if (changes.forceClose && this.forceClose) {
      d3.selectAll(`#sequence${this.sequenceDiagram.root.parent.id}`).remove();
    }
  }

  public ngAfterViewInit(): void {
    this.buildDiagram();
  }

  public ngOnDestroy(): void {
    d3.selectAll(`#sequence${this.sequenceDiagram.root.parent.id}`).remove();
  }

  private prepareData(): void {
    this.sequenceDiagram.generations.map((generation, index) => {
      this._classes.push({ ...generation.parent, index });
      this._operations.push(...generation.operations);
    });
  }

  private buildDiagram(): void {
    const container = this.container.nativeElement;
    const { width, height } = container.getClientRects()[0];
    const { root, edges } = this.sequenceDiagram;
    const id = root.parent.id;
    const diagramHelper = new SequenceDiagramHelper(
      this._classes,
      this._operations,
      edges,
      width,
      height
    );
    diagramHelper.setRoot(root.parent, root.operations[0]);
    diagramHelper.startCalculateDiagram();
    const edgeCollection = diagramHelper.edgeCollection;
    const classCollection = diagramHelper.classCollection;
    const operationCollection = diagramHelper.operationCollection;
    const edgeData: Array<any> = diagramHelper.edges;
    const operationData = diagramHelper.operationData;
    const edgeDefaultGraph = diagramHelper.edgeDefaultGraph;

    const scaleX = diagramHelper.graphWidth / width;
    const scaleY = diagramHelper.graphHeight / height;
    const fontSize = diagramHelper.fontSizeOperationName;
    const sizeClassName = diagramHelper.fontSizeClassName;

    const that = this;
    d3.select('.sequence-diagram').remove();

    const getBoundingHeightClassName = (): number => {
      return sizeClassName + 40;
    };

    const adjustOperationGraph = (
      classId: string,
      moveToX: number,
      adjustHeight: boolean
    ) => {
      operationData
        .filter((o) => o.parent === classId)
        .map((o) => {
          const operationData = operationCollection[o.id];
          const distanceYAdjust = adjustHeight
            ? (o.orderOperation || 0) * 4 * scaleY
            : 0;

          operationData.location.y = operationData.location.y + distanceYAdjust;

          operationCollection[o.id] = {
            ...operationData,
            location: {
              x: operationData.location.x + moveToX,
              y: operationData.location.y,
            },
            distanceYAdjust,
          };

          d3.select(`#o-container-${o.id}`).attr(
            'transform',
            `translate(${operationData.location.x + moveToX}, ${
              operationData.location.y
            })`
          );
        });
    };

    const adjustEdgeGraph = (adjustHeight: boolean) => {
      edgePath.attr('d', (_edge) => {
        const {
          moveTo,
          lineTo,
          horizontal,
          vertical,
          selfLoop,
          advance,
        } = edgeCollection[_edge.id];

        const target = operationCollection[_edge.target];
        const source = operationCollection[_edge.source];
        const rightDirection = target.location.x - source.location.x >= 0;

        const edgeData = {
          ...edgeCollection[_edge.id],
          moveTo: {
            x: rightDirection ? source.location.x + 10 : source.location.x,
            y: moveTo.y + (source.distanceYAdjust || 0),
          },
          lineTo: {
            x: rightDirection ? target.location.x : target.location.x + 10,
            y: lineTo.y + (target.distanceYAdjust || 0),
          },
        };

        if (selfLoop) {
          edgeData.vertical = edgeData.lineTo.y - edgeData.moveTo.y;
          edgeData.moveTo.x = edgeData.lineTo.x;
          edgeCollection[_edge.id] = { ...edgeData };
          return `M ${source.location.x} ${edgeData.moveTo.y} h -${horizontal} v ${edgeData.vertical} h ${horizontal}`;
        }

        if (advance) {
          const targetY = lineTo.y + (target.distanceYAdjust || 0);
          const sourceY = moveTo.y + (source.distanceYAdjust || 0);
          edgeCollection[_edge.id] = {
            ...edgeData,
            advance: {
              ...advance,
              vertical: targetY - sourceY,
            },
          };

          return `M ${edgeData.moveTo.x} ${edgeData.moveTo.y} h ${
            advance.horizontal
          } v ${targetY - sourceY} L ${edgeData.lineTo.x} ${targetY}`;
        }

        edgeCollection[_edge.id] = { ...edgeData };
        const differentHeight = edgeData.lineTo.y - edgeData.moveTo.y > 0;
        if (differentHeight) {
          edgeData.moveTo.y = edgeData.lineTo.y;
          operationCollection[_edge.source].height =
            edgeData.lineTo.y - source.location.y + 5;

          d3.select(`#operation-${_edge.source}`).attr(
            'height',
            edgeData.lineTo.y - source.location.y + 5
          );
        }

        return `M ${edgeData.moveTo.x} ${edgeData.moveTo.y} L ${edgeData.lineTo.x} ${edgeData.lineTo.y}`;
      });

      edgePolygon.attr('points', (edge) => {
        const { lineTo, moveTo } = edgeCollection[edge.id];
        const differ = lineTo.x - moveTo.x;

        const top = {
          x: lineTo.x,
          y: lineTo.y,
        };
        const right = {
          x: differ >= 0 ? top.x - 5 : top.x + 5, //left
          y: top.y - 5,
        };

        const left = {
          x: differ >= 0 ? top.x - 5 : top.x + 5,
          y: top.y + 5,
        };

        return `${top.x},${top.y} ${right.x},${right.y} ${left.x},${left.y}`;
      });
    };

    const adjustGraph = () => {
      const graphContainer: any = d3.select(`#sequence${id}`).node();
      const classesContainer: any = d3.select(`#ClassFrame${id}`).node();
      const distanceToTop =
        graphContainer.getBoundingClientRect().height -
        classesContainer.getBoundingClientRect().height;
      const adjustHeight = distanceToTop > 200 && scaleX > 2 && scaleY > 2;

      let scale = scaleX;
      if (diagramHelper.graphWidth < width) {
        scale = scaleY < 1 ? 1 : scaleY;
      } else if (scaleX < 1) {
        scale = scaleY < 2 ? 2 : scaleY;
      } else if (scaleX < 2 && scaleX > 1 && scaleY < 2 && scaleY > 1) {
        scale = 2;
      }

      const marginTopBottom =
        diagramHelper.graphHeight < height ? 20 : 20 * scaleY;
      const marginLeftRight = 20 * scale;

      that._classes.map((_c, index) => {
        const classGraph = classCollection[_c.id];
        const classElementGraph: any = d3.select(`#class-zone-${_c.id}`).node();
        const classZone = classElementGraph.getBoundingClientRect();
        const classRect = d3.select(`#class-bound-${_c.id}`);
        // current Looping Edges
        const numberEdgesLoop = diagramHelper.getNumberLoopedEdgesByClass(
          _c.id
        );
        const classLabelElement: any = d3.select(`#class-label-${_c.id}`);
        const labelBound = classLabelElement.node().getBoundingClientRect();

        const classRectangleWidth =
          (labelBound.right - labelBound.left) * scale + marginLeftRight;
        classCollection[_c.id].width = classRectangleWidth;
        const rectTangleHeight = sizeClassName + marginTopBottom;

        classRect
          .attr(
            'x',
            classGraph.lineBody.x1 -
              ((_c.name.length / 2) * sizeClassName) / 2 -
              marginLeftRight / 2
          )
          .attr('y', adjustHeight ? -((distanceToTop * scaleY) / 3) : 0) // 60 as padding to top
          .attr('width', classRectangleWidth)
          .attr('height', rectTangleHeight);

        classLabelElement.attr(
          'y',
          adjustHeight
            ? -(distanceToTop * scaleY) / 3 +
                rectTangleHeight / 1.3 -
                marginTopBottom / 3
            : rectTangleHeight / 1.3 - marginTopBottom / 3
        );

        d3.select(`#class-zone-${_c.id}`).attr(
          'y1',
          adjustHeight
            ? -(distanceToTop * scaleY) / 3 + rectTangleHeight
            : rectTangleHeight
        );

        if (index === 0) {
          const rootOperationName: any = d3
            .select(`#op-label-${root.operations[0].id}`)
            .node();
          const bounding = rootOperationName.getBoundingClientRect();
          const moveToX =
            (bounding.right - classZone.x) * scaleX >
            (numberEdgesLoop * 10 + 40) * scaleX
              ? (bounding.right - classZone.x) * scaleX
              : numberEdgesLoop * 10 * scaleX;

          classGraph.classLocation.x = classGraph.classLocation.x + moveToX;

          d3.select(`#class-${_c.id}`).attr(
            'transform',
            `translate(${classGraph.classLocation.x}, ${classGraph.classLocation.y})`
          );

          adjustOperationGraph(_c.id, moveToX, adjustHeight);
          return;
        }

        // get max Operation name of previous class
        const prevClassId = that._classes[index - 1].id;
        const prevGraph = classCollection[prevClassId];
        const prevBoundElement: any = d3
          .select(`#class-bound-${prevClassId}`)
          .node();
        const prevBound = prevBoundElement.getBoundingClientRect();

        let maxOpName = prevBound.right;
        that._operations
          .filter((o) => o.parent === prevClassId)
          .map((o) => {
            const opElement: any = d3.select(`#op-label-${o.id}`).node();
            const boundOpName = opElement.getBoundingClientRect();
            maxOpName =
              maxOpName < boundOpName.right ? boundOpName.right : maxOpName;
          });

        const prevClassRightLocation =
          prevGraph.classLocation.x + prevBound.width * scale;
        const classBoundElement: any = classRect.node();
        const limitedSpaceToMove =
          (maxOpName - classZone.x) * scaleX + (numberEdgesLoop * 10 + 40) + 20;

        let moveToX = limitedSpaceToMove;
        if (
          prevGraph.classLocation.x >= classGraph.classLocation.x ||
          prevGraph.classLocation.x + prevBound.width >=
            classGraph.classLocation.x
        ) {
          moveToX =
            limitedSpaceToMove +
            (prevBound.right - classBoundElement.getBoundingClientRect().left);
        }

        if (
          classGraph.classLocation.x + limitedSpaceToMove <=
          prevClassRightLocation
        ) {
          moveToX =
            limitedSpaceToMove < 0
              ? limitedSpaceToMove + 40 * scale
              : prevBound.right -
                classBoundElement.getBoundingClientRect().left +
                limitedSpaceToMove;
        }

        classGraph.classLocation.x =
          classGraph.classLocation.x +
          (moveToX > -50 && moveToX < 0 ? 0 : moveToX);

        d3.select(`#class-${_c.id}`).attr(
          'transform',
          `translate(${classGraph.classLocation.x}, ${classGraph.classLocation.y})`
        );

        diagramHelper.graphWidth =
          classGraph.classLocation.x + classRectangleWidth;
        adjustOperationGraph(
          _c.id,
          moveToX > -50 && moveToX < 0 ? 0 : moveToX,
          adjustHeight
        );
      });

      if (adjustHeight) {
        diagramHelper.graphHeight += (distanceToTop * scaleY) / 3;
      }

      adjustEdgeGraph(adjustHeight);
      svgRoot.attr(
        'viewBox',
        `0 0 ${
          diagramHelper.graphWidth < width ? width : diagramHelper.graphWidth
        } ${
          diagramHelper.graphHeight < height
            ? height
            : diagramHelper.graphHeight
        }`
      );
    };

    const appendHighLight = (edges: Array<any>, nodes: Array<any>) => {
      edges.map((edge) => {
        const {
          selfLoop,
          moveTo,
          lineTo,
          horizontal,
          vertical,
          advance,
        } = edgeCollection[edge.id];
        highLightContainer
          .append('path')
          .attr('class', 'edge-highlight')
          .attr('d', () => {
            if (advance) {
              return `M ${moveTo.x} ${moveTo.y} h ${advance.horizontal} v ${advance.vertical} L ${lineTo.x} ${lineTo.y}`;
            }

            return selfLoop
              ? `M ${moveTo.x} ${moveTo.y} h -${horizontal} v ${vertical} h ${horizontal}`
              : `M ${moveTo.x} ${moveTo.y} L ${lineTo.x} ${lineTo.y}`;
          })
          .attr('stroke', '#212121')
          .attr('fill', 'none')
          .attr('stroke-width', `${8}px`)
          .attr('stroke-dasharray', '20,10,5,5,5,10');
      });

      nodes.map((node) => {
        const { width, height, location } = operationCollection[node.id];
        highLightContainer
          .append('rect')
          .attr('class', 'node-highlight')
          .attr('width', `${width + 10}px`)
          .attr('height', `${height + 10}px`)
          .attr('transform', `translate(${location.x - 5}, ${location.y - 5})`)
          .attr('fill', 'transparent')
          .attr('stroke', '#4a4a4a')
          .attr('stroke-width', `${4}px`)
          .attr('stroke-dasharray', '20,10,5,5,5,10');
      });
    };

    const svgRoot = d3
      .select(this.element.nativeElement)
      .append('svg')
      .attr('class', 'sequence-diagram')
      .attr('id', `sequence${id}`)
      .attr(
        'viewBox',
        `0 0  ${
          diagramHelper.graphWidth < width ? width : diagramHelper.graphWidth
        } ${
          diagramHelper.graphHeight < height
            ? height
            : diagramHelper.graphHeight
        }`
      )
      .attr('width', width)
      .attr('height', height)
      .on('click', function () {
        d3.event.preventDefault();
        const elementId = d3.event.target.id;
        if (elementId === `sequence${id}`) {
          d3.selectAll('.edge-highlight').remove();
          d3.selectAll('.node-highlight').remove();
        }
      })
      .call(
        d3.zoom<any, any>().on('zoom', function () {
          const [svg] = svgRoot.nodes();
          svg.childNodes.forEach((g: SVGElement) => {
            g.setAttribute('transform', d3.event.transform);
          });
        })
      );

    if (!that._operations.length) {
      const emptyGraphContainer = svgRoot
        .append('g')
        .attr('class', 'empty-reference')
        .attr('transform', `translate(20, 20)`);

      emptyGraphContainer
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'transparent')
        .attr('stroke', '#4287f5')
        .attr('width', width - 40)
        .attr('height', height - 40);

      emptyGraphContainer
        .append('text')
        .attr('font-size', '50px')
        .attr('fill', '#0c56cc')
        .attr('x', width / 6)
        .attr('y', height / 2)
        .text('There are no references existed to render');
      return;
    }

    const classContainer = svgRoot
      .append('g')
      .attr('id', 'ClassFrame' + id)
      .selectAll('g')
      .data(that._classes)
      .join('g')
      .attr('id', (d) => `class-${d.id}`)
      .attr('transform', (d) => {
        const classFrame = classCollection[d.id];
        return `translate(${classFrame.classLocation.x}, ${classFrame.classLocation.y})`;
      })
      .attr('class', 'class-container');

    classContainer
      .append('rect')
      .attr('id', (d) => `class-bound-${d.id}`)
      .attr('y', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('fill', '#2e7fff');

    classContainer
      .append('text')
      .attr('id', (d) => `class-label-${d.id}`)
      .attr('fill', 'white')
      .attr('x', (_c) => {
        const { lineBody } = classCollection[_c.id];
        return lineBody.x1 - ((_c.name.length / 2) * sizeClassName) / 2;
      })
      .attr('y', (d) => {
        return getBoundingHeightClassName() / 1.5;
      })
      .attr('font-size', `${sizeClassName}px`)
      .attr('class', 'text')
      .text((d) => d.name);

    /* (d.name.length * 0.5 * that.FONT_SIZE) / 2 */
    classContainer
      .append('line')
      .style('stroke', '#888')
      .attr('id', (d) => `class-zone-${d.id}`)
      .attr('x1', (d) => {
        const { lineBody } = classCollection[d.id];
        return lineBody.x1;
      })
      .attr('y1', (d) => {
        return getBoundingHeightClassName();
      })
      .attr('x2', (d) => {
        const { lineBody } = classCollection[d.id];
        return lineBody.x2;
      })
      .attr('y2', (d) => {
        return diagramHelper.graphHeight + 50;
      });

    const operations = svgRoot
      .append('g')
      .attr('id', 'sequence-operation')
      .selectAll('g')
      .data([root.operations[0], ...that._operations])
      .join('g')
      .attr('id', (o) => `o-container-${o.id}`)
      .attr('transform', (o) => {
        const { location } = operationCollection[o.id];
        return `translate(${location.x}, ${location.y})`;
      });

    operations
      .append('rect')
      .attr('id', (o) => `operation-${o.id}`)
      .attr('cursor', 'pointer')
      .attr('fill', '#4287f5')
      .attr('stroke-width', '1px')
      .attr('stroke', (o) => {
        const { strokeColor } = operationCollection[o.id];
        return strokeColor ? strokeColor : '#4287f5';
      })
      .attr('width', (o) => {
        const { width } = operationCollection[o.id];
        return width + 'px';
      })
      .attr('height', (o) => {
        const { height } = operationCollection[o.id];
        return height + 'px';
      })
      .on('mouseover', function (o) {
        d3.event.preventDefault();
        d3.select(this).attr('stroke-width', '4px');
        d3.select(`#op-label-${o.id}`).attr('font-size', `${fontSize + 3}px`);
        edges
          .filter((e) => e.source === o.id)
          .map((e) =>
            d3
              .select(`#edge-${e.id}`)
              .attr('stroke-width', edgeDefaultGraph.strokeHover)
          );
      })
      .on('mouseout', function (o) {
        d3.event.preventDefault();
        d3.select(this).attr('stroke-width', '1px');
        d3.select(`#op-label-${o.id}`).attr('font-size', `${fontSize}px`);
        edges
          .filter((e) => e.source === o.id)
          .map((e) =>
            d3
              .select(`#edge-${e.id}`)
              .attr('stroke-width', edgeDefaultGraph.strokeWidth)
          );
      })
      .on('click', function (o) {
        d3.event.preventDefault();
        d3.selectAll('.edge-highlight').remove();
        d3.selectAll('.node-highlight').remove();
        appendHighLight(
          edges.filter((e) => e.source === o.id),
          [o]
        );
      });

    const operationNameElement = operations
      .append('text')
      .attr('id', (o) => `op-label-${o.id}`)
      .attr('y', (o) =>
        o.id === root.operations[0].id && that._operations.length ? 200 : 15
      )
      .attr('font-size', `${fontSize}px`)
      .attr('font-weight', '600')
      .attr('fill', '#0c56cc')
      .on('mouseover', function (o) {
        d3.event.preventDefault();
        d3.select(`#operation-${o.id}`).attr('stroke-width', '4px');
        d3.select(this).attr('font-size', `${fontSize + 3}px`);
        edges
          .filter((e) => e.source === o.id)
          .map((e) =>
            d3
              .select(`#edge-${e.id}`)
              .attr('stroke-width', edgeDefaultGraph.strokeHover)
          );
      })
      .on('mouseout', function (o) {
        d3.event.preventDefault();
        d3.select(`#operation-${o.id}`).attr('stroke-width', '1px');
        d3.select(this).attr('font-size', `${fontSize}px`);
        edges
          .filter((e) => e.source === o.id)
          .map((e) =>
            d3
              .select(`#edge-${e.id}`)
              .attr('stroke-width', edgeDefaultGraph.strokeWidth)
          );
      })
      .on('click', function (o) {
        d3.event.preventDefault();
        d3.selectAll('.edge-highlight').remove();
        d3.selectAll('.node-highlight').remove();
        appendHighLight(
          edges.filter((e) => e.source === o.id),
          [o]
        );
      });

    operationNameElement
      .append('tspan')
      .attr('x', 15)
      .text((o) => {
        const { name } = operationCollection[o.id];
        return name;
      });

    operationNameElement
      .append('tspan')
      .attr('x', (o) => {
        const { lineBreak } = operationCollection[o.id];
        return lineBreak ? 5 : '';
      })
      .attr('dy', (o) => {
        const { lineBreak } = operationCollection[o.id];
        return lineBreak ? '1.2em' : 0;
      })
      .attr('font-style', 'italic')
      .text((o) => {
        const { parameters } = operationCollection[o.id];
        return `(${parameters})`;
      });

    const edge = svgRoot
      .append('g')
      .attr('class', 'sequences-edges')
      .selectAll('g')
      .data(edgeData)
      .join('g');

    const edgePath = edge
      .append('path')
      .attr('id', (edge) => `edge-${edge.id}`)
      .attr('cursor', 'pointer')
      .attr('stroke', (edge) => {
        const { color } = edgeCollection[edge.id];
        return color ? color : edgeDefaultGraph.color;
      })
      .attr('stroke-width', edgeDefaultGraph.strokeWidth)
      .attr('fill', 'none')
      .on('mouseover', function (edge) {
        d3.event.preventDefault();
        d3.select(this).attr('stroke-width', edgeDefaultGraph.strokeHover);
        that._operations
          .filter((o) => o.id === edge.source || o.id === edge.target)
          .map((o) => {
            d3.select(`#operation-${o.id}`).attr('stroke-width', '4px');

            d3.select(`#op-label-${o.id}`).attr(
              'font-size',
              `${fontSize + 3}px`
            );
          });
      })
      .on('mouseout', function (edge) {
        d3.event.preventDefault();
        d3.select(this).attr('stroke-width', edgeDefaultGraph.strokeWidth);
        that._operations
          .filter((o) => o.id === edge.source || o.id === edge.target)
          .map((o) => {
            const { location, width } = operationCollection[o.id];
            d3.select(`o-container-${o.id}`).attr(
              'transform',
              `translate(${location.x}, ${location})`
            );
            d3.select(`#operation-${o.id}`)
              .attr('stroke-width', '2px')
              .attr('width', `${width}px`);
            d3.select(`#op-label-${o.id}`).attr('font-size', `${fontSize}px`);
          });
      })
      .on('click', function (edge) {
        d3.event.preventDefault();
        d3.selectAll('.edge-highlight').remove();
        d3.selectAll('.node-highlight').remove();
        appendHighLight(
          [edge],
          that._operations.filter(
            (o) => o.id === edge.source || o.id === edge.target
          )
        );
      });

    const edgePolygon = edge
      .append('polygon')
      .attr('id', (edge) => `poly-${edge.id}`)
      .attr('stroke', (edge) => {
        const { color } = edgeCollection[edge.id];
        return color ? color : edgeDefaultGraph.color;
      })
      .attr('fill', (edge) => {
        const { color } = edgeCollection[edge.id];
        return color ? color : edgeDefaultGraph.color;
      });

    const highLightContainer = svgRoot.append('g').attr('id', 'highlight');

    setTimeout(() => adjustGraph(), 800);
  }
}
