import React, { isValidElement } from 'react';
import Point from '../utils/Point';
import './GridModalComponent.css';
import { dom } from '../dom.extension';
import { Toggle } from 'react-toggle-component';
import Session, { SessionKey } from '../utils/Session';

interface GridModalComponentProps {
    screenSize: Point;
    layout: { x: number[]; y: number[] };
    setLayout: (lx: number[], ly: number[]) => void;
    enable: boolean;
    close: () => void;
    resize: () => void;
}

interface GridModalComponentState {
    canvasFrameSize: Point;
    disableResize: boolean;
}

export default class GridModalComponent extends React.Component<GridModalComponentProps, GridModalComponentState> {
    canvasContext: CanvasRenderingContext2D | null = null;
    grid: any | null;
    side = 64;
    space = 8;

    object: { baseObject: number[][]; currentObject: number[][]; selectIndex: number } = {
        baseObject: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]],
        currentObject: [[1, 2, 3, -1], [4, 5, 6, -1], [7, 8, 9, -1], [-1, -1, -1, -1]],
        selectIndex: -1,
    };

    constructor(props: GridModalComponentProps) {
        super(props);
        this.state = { canvasFrameSize: new Point(0, 0), disableResize: false };
    }

    componentDidMount() {
        const { width: width, height: height } = dom(this.refs.canvasFrame);
        this.setState({ canvasFrameSize: new Point(width - 32, height - 32) });
        this.canvasContext = (this.refs.canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
        this.renderCanvas();
        this.handlerCanvas();
    }

    shouldComponentUpdate(nextProps: GridModalComponentProps, nextState: GridModalComponentState, nextContext: any) {
        const obj: number[][] = [[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]];
        let i = 1;
        nextProps.layout.x.map((g, x) => nextProps.layout.y.map((g, y) => (obj[x][y] = i++)));
        this.object.currentObject = obj;
        this.renderCanvas();

        if (this.props.enable != nextProps.enable) {
            const enableResize = Session.load(SessionKey.EnableResize) != 'false';
            if (enableResize) window.addEventListener('resize', this.props.resize);
            else window.removeEventListener('resize', this.props.resize);
            nextState.disableResize = !enableResize;
        }

        return true;
    }

    render() {
        return (
            <div className={'setting-frame ' + (this.props.enable ? 'enable' : 'disable')}>
                <div className={'setting-overlay'} onClick={this.props.close} />
                <div className="setting-base" onClick={() => {}}>
                    {/* <button type="button" className="btn btn-icon setting-header-btn" onClick={this.props.close}> */}
                    {/* <FontAwesomeIcon icon={faChevronLeft} /> */}
                    {/* </button> */}
                    <div className="setting-header">設定</div>
                    <div className="setting-content" ref="canvasFrame" style={{ overflowY: 'hidden' }}>
                        <div className="pb-5">
                            <Toggle
                                name="toggle-1"
                                checked={this.state.disableResize}
                                controlled={true}
                                rightBackgroundColor="#00A497"
                                knobColor={this.state.disableResize ? '#FFF' : '#00A497'}
                                borderColor="#00A497"
                                onToggle={e => this.setState({ disableResize: !this.state.disableResize })}
                            />
                            {' リサイズ時に動画をリロードしない'}
                        </div>
                        <div className="pb-5">
                            コンテンツ配置
                            <canvas
                                ref="canvas"
                                width={this.state.canvasFrameSize.x}
                                height={this.state.canvasFrameSize.x}
                                style={{ width: this.state.canvasFrameSize.x + 'px', height: this.state.canvasFrameSize.x + 'px' }}
                            />
                        </div>
                    </div>
                    <div className="setting-footer">
                        <button type="button" className="btn ml-1 setting-button" style={{ width: '80px' }} onClick={this.props.close}>
                            {'Close'}
                        </button>
                        <button type="button" className="btn ml-1 setting-button positive" style={{ width: '80px' }} onClick={this.hideModal}>
                            {'Apply'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderCanvas = () => {
        const context = this.canvasContext as CanvasRenderingContext2D;
        const width = (this.refs.canvas as HTMLCanvasElement).width;
        const height = (this.refs.canvas as HTMLCanvasElement).height;
        this.side = width / 10;
        this.space = this.side / 10;
        const d = this.side;

        context.globalAlpha = 1;
        context.clearRect(0, 0, width, height);
        context.font = '16px serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const rect = (p: Point, index: number | string, draggable: boolean) => {
            context.beginPath();
            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.fillStyle = draggable ? 'rgba(23, 162, 184, 1)' : 'rgba(23, 162, 184, 0.5)';
            if (index == 'clear') context.fillStyle = this.object.selectIndex != -1 ? 'rgba(108, 117, 125, 1)' : 'rgba(108, 117, 125, 0.5)';
            index != -1 && context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.fillStyle = draggable ? 'rgba(0, 0, 0, 0.9)' : 'rgba(128, 128, 128, 0.5)';
            context.strokeStyle = draggable ? 'rgba(0, 0, 0, 0.9)' : 'rgba(128, 128, 128, 0.5)';
            context.rect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            if (index == 'clear') context.fillText(`${index}`, p.x, p.y);
            context.closePath();
            context.stroke();

            if (this.object.selectIndex == index && index != -1) {
                context.beginPath();
                context.fillStyle = 'rgba(255, 193, 7, 1)';
                context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
                context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
                context.closePath();
                context.stroke();
            }
        };

        const base = (p: Point) => {
            context.beginPath();
            context.fillStyle = 'rgba(192, 192, 192, 0.9)';
            context.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            context.fillRect(-(d / 2) + p.x, -(d / 2) + p.y, d, d);
            context.closePath();
            context.stroke();
            console.log();
        };

        const size = (p: Point) => {
            context.beginPath();
            context.fillStyle = 'rgba(220, 53, 69, 0.8)';
            context.strokeStyle = 'rgba(220, 53, 69, 0.8)';
            context.fillRect(0, d / 2 - this.space, (d + this.space) * (p.x + 1) + this.space, (d + this.space) * (p.y + 1) + this.space);
            context.closePath();
            context.stroke();
        };

        size(this.getLayout());

        this.object.baseObject.map((g, x) =>
            g.map((p, y) => {
                base(this.pointCurrent(x, y));
            }),
        );

        this.object.currentObject.map((g, x) =>
            g.map((p, y) => {
                rect(this.pointCurrent(x, y), p, true);
            }),
        );

        this.stockObj().map((p, i, xl) => {
            rect(this.pointStoke(i), p, i == 0);
        });
        rect(this.pointStoke(this.stockObj().length), 'clear', this.object.selectIndex != -1);
    };

    pointCurrent = (x: number, y: number): Point => {
        const px = +this.side / 2 + this.space + (this.side + this.space) * x;
        const py = +this.side + (this.side + this.space) * y;
        return new Point(px, py);
    };

    pointStoke = (i: number): Point => {
        const width = (this.refs.canvas as HTMLCanvasElement).width;
        const px = -this.side / 2 - this.space + width - (this.side + this.space) * Math.floor(i / 4);
        const py = +this.side + (this.side + this.space) * (i % 4);
        return new Point(px, py);
    };

    stockObj = () => {
        return this.object.baseObject.flatMap(x => x).filter(a => this.object.currentObject.flatMap(x => x).indexOf(a) == -1);
    };

    getLayout = (): Point => {
        let lenx = 0;
        let leny = 0;
        this.object.currentObject.map((g, x) =>
            g.map((p, y) => {
                if (p != -1) {
                    lenx = lenx > x ? lenx : x;
                    leny = leny > y ? leny : y;
                }
            }),
        );
        return new Point(lenx, leny);
    };

    handlerCanvas = () => {
        (this.refs.canvas as HTMLCanvasElement).addEventListener('click', this.onClick);
    };

    onClick = (e: any) => {
        const rect = (this.refs.canvas as HTMLCanvasElement).getBoundingClientRect();
        const point = new Point(e.clientX - rect.left, e.clientY - rect.top);
        const swap = (x: number, y: number, index: number): number[][] => {
            const selectIndex = this.object.selectIndex;
            // console.log(`x: ${x}, y: ${y}, index: ${index}, selectIndex: ${selectIndex}`);
            const result = this.object.baseObject.map((g, ix) => {
                return g.map((i, iy) => {
                    const c = this.object.currentObject[ix][iy];
                    if (x == ix && y == iy) return selectIndex;
                    if (c == selectIndex) return index;
                    return c;
                });
            });
            return result;
        };
        // Select
        this.object.currentObject.map((g, x) => {
            return g.map((index, y) => {
                const p = this.pointCurrent(x, y);
                if (p.dist(point) < 36) {
                    if (this.object.selectIndex == -1) {
                        this.object.selectIndex = index;
                    } else {
                        this.object.currentObject = swap(x, y, index);
                        this.object.selectIndex = -1;
                    }
                }
            });
        });
        // Stoke
        this.stockObj().map((index, i, il) => {
            const p = this.pointStoke(i);
            if (p.dist(point) < 36 && i == 0) {
                this.object.selectIndex = index;
            }
        });
        // CLear
        const p = this.pointStoke(this.stockObj().length);
        if (p.dist(point) < 36) {
            this.object.currentObject = swap(-1, -1, -1);
            this.object.selectIndex = -1;
        }
        this.renderCanvas();
    };

    hideModal = () => {
        $('#gridModal').modal('hide');
        const x = this.getLayout().x + 1;
        const y = this.getLayout().y + 1;
        console.log(x, y);
        this.props.setLayout(Array(x).fill(1), Array(y).fill(1));
        Session.save(SessionKey.EnableResize, !this.state.disableResize ? 'true' : 'false');
        this.props.close();
    };
}
