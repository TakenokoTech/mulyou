import React from 'react';
import Point from '../utils/Point';
import './GridModalComponent.css';
import { dom } from '../dom.extension';

interface GridModalComponentProps {
    screenSize: Point;
}

interface GridModalComponentState {
    canvasFrameSize: Point;
}

export default class GridModalComponent extends React.Component<GridModalComponentProps, GridModalComponentState> {
    canvasContext: CanvasRenderingContext2D | null = null;
    grid: any | null;

    constructor(props: GridModalComponentProps) {
        super(props);
        this.state = { canvasFrameSize: new Point(0, 0) };
    }

    componentDidMount() {
        this.canvasContext = (this.refs.canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
        this.renderCanvas();
        this.handlerCanvas();
    }

    componentWillReceiveProps() {}

    render() {
        return (
            <>
                <button type="button" className="btn btn-info" onClick={this.showModal}>
                    グリッド調整
                </button>
                <div className="modal fade" id="gridModal" ref="modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    コンテンツ配置
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" ref="canvasFrame" onClick={this.onClick} style={{ height: '400px' }}>
                                <canvas
                                    ref="canvas"
                                    width={this.state.canvasFrameSize.x}
                                    height={this.state.canvasFrameSize.y}
                                    style={{ width: this.state.canvasFrameSize.x + 'px', height: this.state.canvasFrameSize.y + 'px' }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => {}}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    object: { currentObject: { index: number; p: Point }[]; stockObject: { index: number; p: Point }[]; selectIndex: number } = {
        currentObject: [],
        stockObject: [],
        selectIndex: -1,
    };

    renderCanvas = () => {
        const context = this.canvasContext as CanvasRenderingContext2D;
        const width = (this.refs.canvas as HTMLCanvasElement).width;
        const height = (this.refs.canvas as HTMLCanvasElement).height;
        const d = 64;

        context.globalAlpha = 1;
        context.clearRect(0, 0, width, height);

        context.font = '16px serif';

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const rect = (p: Point, index: number, draggable: boolean) => {
            context.beginPath();
            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.closePath();
            context.stroke();

            if (this.object.selectIndex == index) {
                context.beginPath();
                context.fillStyle = 'rgba(255, 0, 0, 0.5)';
                context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
                context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
                context.closePath();
                context.stroke();
            }

            context.beginPath();
            context.fillStyle = draggable ? 'rgba(0, 0, 0, 0.9)' : 'rgba(128, 128, 128, 0.5)';
            context.strokeStyle = draggable ? 'rgba(0, 0, 0, 0.9)' : 'rgba(128, 128, 128, 0.5)';
            context.rect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.fillText(`${index}`, p.x, p.y);
            context.closePath();
            context.stroke();
        };

        const base = (p: Point, index: number) => {
            context.beginPath();
            context.fillStyle = 'rgba(192, 192, 192, 0.9)';
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.closePath();
            context.stroke();
        };

        [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]].map((g, x, xl) => {
            return g.map((p, y, yl) => {
                const point = new Point(72 * (1 + x), 72 * (1 + y));
                base(point, p);
            });
        });

        const list1: { index: number; p: Point }[] = [];
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((g, x, xl) => {
            return g.map((p, y, yl) => {
                const point = new Point(72 * (1 + x), 72 * (1 + y));
                list1.push({ index: p, p: point });
                rect(point, p, true);
            });
        });
        this.object.currentObject = list1;

        const list2: { index: number; p: Point }[] = [];
        [10, 11, 12, 13, 14, 15, 16].map((p, i, xl) => {
            const point = new Point(width - 72 * (1 + Math.floor(i / 4)), 72 * (1 + (i % 4)));
            list2.push({ index: p, p: point });
            rect(point, p, i == 0);
        });
        this.object.stockObject = list2;
    };

    handlerCanvas = () => {
        (this.refs.canvas as HTMLCanvasElement).addEventListener('click', e => {
            const rect = (this.refs.canvas as HTMLCanvasElement).getBoundingClientRect();
            const point = new Point(e.clientX - rect.left, e.clientY - rect.top);
            this.object.currentObject.forEach((v, i) => {
                if (v.p.dist(point) < 36) {
                    this.object.selectIndex = v.index;
                }
            });
            this.object.stockObject.forEach((v, i) => {
                if (v.p.dist(point) < 36) {
                    this.object.selectIndex = v.index;
                }
            });
            this.renderCanvas();
        });
    };

    onClick = () => {
        console.log();
    };

    showModal = () => {
        $('#gridModal').modal('show');
        $('#gridModal').on('shown.bs.modal', (e: any) => {
            const { width: width, height: height } = dom(this.refs.canvasFrame);
            this.setState({ canvasFrameSize: new Point(width - 32, height - 32) });
            this.renderCanvas();
        });
    };

    hideModal = () => {
        $('#gridModal').modal('hide');
    };
}
