import { ArrayHelper } from '../../../../libs/array.utils';

export class SequenceDiagramHelper {
  public classCollection = {};
  public edgeCollection = {};
  public operationCollection = {};
  public graphWidth = 0;
  public graphHeight = 0;

  private maxElements = 0;
  private _operationData = [];
  private _classData = [];
  private _edgeData = [];
  private _vertSpace = 100;
  private _rootOperation: any;
  private _rootClass: any;
  public defaultEdgeDistance = 80;

  private XPAD = 150;
  private YPAD = 20;
  private VERT_PAD = 60;
  private FONT_SIZE = 14;

  private CLASS_PADDING = 20;
  private CLASS_HEIGHT = 40;
  private EDGE_PADDING = 40;
  private MESSAGE_PADDING = 20;
  private operationWidth = 10;

  private containerWidth;
  private containerHeight;
  private scaleX = 1;
  private scaleY = 1;
  private _crossEdges = [];
  private _loopedEdges = [];

  constructor(
    classes: Array<any>,
    operations: Array<any>,
    edges: Array<any>,
    width: number,
    height: number
  ) {
    this.maxElements = edges.length;
    this._classData = classes;
    this._operationData = operations;
    this._edgeData = edges;
    this.containerWidth = width;
    this.containerHeight = height;
  }

  public get edges(): Array<any> {
    return this._edgeData.sort((a, b) => (a.orderByY <= b.orderByY ? -1 : 1));
  }

  public get operationData(): Array<any> {
    return this._operationData;
  }

  public get edgeDefaultGraph(): {
    color: string;
    strokeWidth: string;
    strokeHover: string;
  } {
    return {
      color: '#666666',
      strokeWidth: '3px',
      strokeHover: '6px',
    };
  }

  public get fontSizeClassName(): number {
    const size = this.scaleX > 4 ? 20 * this.scaleY + 5 : 20 * this.scaleY;
    return size < 20 ? 20 : size;
  }

  public get fontSizeOperationName(): number {
    return 14 * (this.scaleY < 1 ? 1 : this.scaleY);
  }

  public setRoot(rClass: any, operation: any): void {
    this._rootClass = { ...rClass };
    this._rootOperation = { ...operation };
  }

  public startCalculateDiagram(): void {
    this.initialData();
    this.calculateClassGraph();
    this.handleOperations();
    this.handleEdges();
  }

  public getNumberLoopedEdgesByClass(classId: string): number {
    // Looped inside class therefore source or target is the same
    return this._loopedEdges.filter(
      (e) => e.sourceParentId === classId && e.targetParentId === classId
    ).length;
  }

  private classXPosition(classIndex: number): number {
    return this.XPAD + classIndex * this._vertSpace;
  }

  private classHeight(): number {
    return this.operationData.length * (this.defaultEdgeDistance + 20);
  }

  private classWidth(className: string): number {
    return className.length * 0.5 * this.FONT_SIZE + this.CLASS_PADDING * 2;
  }

  private calculateClassGraph(): void {
    this._classData.map((data, index) => {
      // calculate location and width height
      const x = this.classXPosition(index);
      const y = this.YPAD;
      const width = this.classWidth(data.name);

      this.graphWidth =
        this.graphWidth > x + width + this._vertSpace
          ? this.graphWidth
          : x + width + this._vertSpace;

      this.scaleX = this.graphWidth / this.containerWidth;

      this.classCollection[data.id] = {
        classLocation: { x, y },
        width,
        height: this.CLASS_HEIGHT,
        lineBody: {
          x1: width / 2.5,
          y1: y + this.CLASS_HEIGHT,
          x2: width / 2.5,
          y2: this.classHeight(),
        },
        text: {
          x: width / 2.5 - (data.name.length / 2) * 0.5 * this.FONT_SIZE,
          y: 25,
        },
      };
    });
  }

  private calculateEdgeGraph(edge: any) {
    const operation = this._operationData.find((_o) => _o.id === edge.source);

    if (!operation) {
      const target = this.operationCollection[edge.target];
      const y = target.location.y + 5;
      const lx = target.location.x;
      const rootOp = this.operationCollection[this._rootOperation.id];

      const distanceHeight =
        target.end <= rootOp.end ? 0 : target.end - rootOp.end;

      this.operationCollection[this._rootOperation.id] = {
        ...rootOp,
        height: rootOp.end + distanceHeight,
        end: target.location.y,
      };

      edge.orderByY = target.location.y;

      this.edgeCollection[edge.id] = {
        moveTo: { x: 10, y },
        lineTo: { x: lx, y },
      };
      return;
    }

    const targetOperation = this.operationCollection[edge.target];
    const sourceOperation = this.operationCollection[edge.source];

    const sEdges = this._edgeData.filter(
      (e) => e.source === sourceOperation.id || e.target === sourceOperation.id
    );
    const tEdges = this._edgeData.filter(
      (e) => e.target === targetOperation.id || e.source === targetOperation.id
    );

    const eIndex = sEdges.findIndex((_e) => _e.id === edge.id);
    const tEIndex = tEdges.findIndex((_e) => _e.id === edge.id);

    const selfLoop = targetOperation.parentId === sourceOperation.parentId;
    if (selfLoop) {
      const x = sourceOperation.location.x;
      const y = sourceOperation.location.y + (eIndex + 1) * 5;
      const destination = targetOperation.location.y + (tEIndex + 1) * 5;

      const curClass = this.classCollection[sourceOperation.parentId];
      curClass['loopIndex'] = curClass.loopIndex ? curClass.loopIndex + 1 : 1;

      edge.orderByY = -2;

      this.edgeCollection[edge.id] = {
        moveTo: { x, y },
        lineTo: { x: targetOperation.location.x, y: destination },
        horizontal: 40 + curClass.loopIndex * 10,
        vertical: destination - y,
        selfLoop: true,
        color: sourceOperation.strokeColor
          ? sourceOperation.strokeColor
          : this.randomColor(),
      };

      return;
    }
    const differ = targetOperation.end - sourceOperation.end;
    const lx = targetOperation.location.x;

    const height =
      differ > 0 ? sourceOperation.height + differ : sourceOperation.height;
    this.operationCollection[edge.source] = {
      ...sourceOperation,
      height,
      edgeIndex: sourceOperation.edgeIndex + 1,
      end: differ > 0 ? targetOperation.end : sourceOperation.end,
    };

    this._operationData = ArrayHelper.replace(
      this._operationData,
      { ...operation, height },
      (replace, replaceWith) => replace.id === replaceWith.id
    );
    edge.orderByY = differ < 0 ? -1 : this.operationCollection[edge.source].end;

    // check overlap
    this._operationData
      .filter((o) => o.parent === sourceOperation.parentId)
      .map((operation, index) => {
        const oFrame = this.operationCollection[operation.id];
        if (
          oFrame.location.y < targetOperation.end &&
          sourceOperation.location.y < oFrame.location.y &&
          oFrame.width === this.operationWidth
        ) {
          this.operationCollection[operation.id] = {
            ...oFrame,
            location: {
              x: oFrame.location.x + 10,
              y: oFrame.location.y,
            },
            fromXOriginal: oFrame.fromXOriginal + 10,
            strokeColor: this.randomColor(),
          };
        }
      });

    const isLeftDirection =
      targetOperation.location.x - sourceOperation.location.x < 0;
    const y =
      differ < 0
        ? sourceOperation.end - eIndex * 10
        : targetOperation.end - tEIndex * 10;

    this.edgeCollection[edge.id] = {
      moveTo: {
        x: isLeftDirection
          ? sourceOperation.location.x
          : differ >= 0
          ? sourceOperation.location.x + 10
          : sourceOperation.location.x,
        y,
      },
      lineTo: {
        x: isLeftDirection ? lx + 10 : lx,
        y: differ < 0 ? targetOperation.end - 5 : y,
      },
      advance:
        differ < 0
          ? {
              horizontal: -20,
              vertical: differ,
            }
          : null,
      color: sourceOperation.strokeColor
        ? sourceOperation.strokeColor
        : '#666666',
    };
  }

  private initialData(): void {
    let maxClassName = 0;
    let maxOpName = 0;
    let maxLoopedEdge = 0;
    const operations = [this._rootOperation, ...this._operationData];

    const { id: rId, name, parameters } = this._rootOperation;
    this.operationCollection[rId] = {
      location: { x: 0, y: 40 },
      id: rId,
      name: `${name}(${ArrayHelper.joinBy(parameters, 'name')})`,
      width: this.operationWidth,
      height: 40,
      end: 100,
    };

    // handle Edges Data first.
    this._edgeData.map((e, index) => {
      const sourceOperation = operations.find((o) => o.id === e.source);
      const targetOperation = operations.find((o) => o.id === e.target);

      const edge = {
        ...e,
        orderBy: index,
        sourceParentId: sourceOperation.parent,
        targetParentId: targetOperation.parent,
      };

      sourceOperation.parent !== targetOperation.parent
        ? this._crossEdges.push(edge)
        : this._loopedEdges.push(edge);
    });

    // handle Class and calculate the looping inside class.
    this._classData.map((data, index) => {
      // get max length of class name
      maxClassName =
        maxClassName < data.name.length ? data.name.length : maxClassName;

      const loopEdgesLength = this._loopedEdges.filter(
        (e) => e.sourceParentId === data.id && e.targetParentId === data.id
      ).length;

      maxLoopedEdge =
        maxLoopedEdge < loopEdgesLength ? loopEdgesLength : maxLoopedEdge;
    });

    // handle Operation
    operations.map((o) => {
      const name = `${o.name}(${ArrayHelper.joinBy(o.parameters, 'name')})`;
      maxOpName = maxOpName < name.length ? name.length : maxOpName;
    });

    this._edgeData = [...this._crossEdges, ...this._loopedEdges];

    this.XPAD = this.XPAD + maxOpName * 0.5 * this.FONT_SIZE;

    this._vertSpace =
      maxOpName > maxClassName
        ? maxOpName * 10 + maxLoopedEdge * 10 + 20
        : maxClassName * 15 + maxLoopedEdge * 10 + 20;
  }

  private handleEdges(): void {
    this._edgeData.map((edge, index) => {
      this.calculateEdgeGraph(edge);
    });
  }

  private handleOperations(): void {
    const operationHeight = 40;
    const { id: rId, name, parameters } = this._rootOperation;

    const start = 40 + this.fontSizeClassName;
    const rootName = `${name}(${ArrayHelper.joinBy(parameters, 'name')})`;
    this.operationCollection[rId] = {
      location: { x: 0, y: start },
      id: rId,
      name: name,
      parameters: ArrayHelper.joinBy(parameters, 'name'),
      lineBreak: rootName.length > 50,
      width: this.operationWidth,
      height: operationHeight,
      end: operationHeight,
      edgeIndex: 1,
    };

    let index = 1;
    this._edgeData.map((edge) => {
      const targetOperation = this._operationData.find(
        (o) => o.id === edge.target
      );

      const operationFrame = this.operationCollection[targetOperation.id]
        ? this.operationCollection[targetOperation.id]
        : null;

      const y =
        start + this.MESSAGE_PADDING * 4 * (index + 1) + this.EDGE_PADDING;
      this.graphHeight = this.graphHeight > y ? this.graphHeight : y;
      this.scaleY = this.graphHeight / this.containerHeight;

      if (!operationFrame) {
        const numberEdges = this._edgeData.filter(
          (e) =>
            e.source === targetOperation.id || e.target === targetOperation.id
        ).length;
        const height =
          numberEdges * 5 > operationHeight ? numberEdges * 5 : operationHeight;

        const parent = this._classData.find(
          (c) => c.id === targetOperation.parent
        );
        const parentFrame = this.classCollection[parent.id];
        const operationName = `${targetOperation.name}(${ArrayHelper.joinBy(
          targetOperation.parameters,
          'name'
        )})`;

        const lineBreak = operationName.length > 50;

        const x = parentFrame.classLocation.x + parentFrame.lineBody.x1 - 5;

        this._operationData = ArrayHelper.replace(
          this._operationData,
          {
            ...targetOperation,
            height: operationHeight,
            orderOperation: index,
          },
          (replace, replaceWith) => replace.id === replaceWith.id
        );

        this.operationCollection[targetOperation.id] = {
          location: {
            x,
            y,
          },
          id: targetOperation.id,
          parentId: targetOperation.parent,
          name: targetOperation.name,
          parameters: ArrayHelper.joinBy(targetOperation.parameters, 'name'),
          lineBreak,
          fromXOriginal: 0,
          width: this.operationWidth,
          height,
          color: '#4287f5',
          end: y + height,
          edgeIndex: 1,
        };

        index = lineBreak ? index + 3 : index + 1;
      }
    });
  }

  private randomColor(): string {
    const redRandomNumber = Math.random() * 150;
    const greenRandomNumber = Math.random() * 150;
    const blueRandomNumber = Math.random() * 170;

    const r = redRandomNumber > 150 ? 150 : redRandomNumber;
    const g = greenRandomNumber > 150 ? 150 : greenRandomNumber;
    const b = blueRandomNumber > 170 ? 170 : blueRandomNumber;
    const a = 1;
    const color = `rgba(${r},${g},${b},${a})`;

    return color;
  }
}
