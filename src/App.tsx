import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube';
import './App.css';
import { dom } from './dom.extension';
import Point from './utils/Point';
import { number } from 'prop-types';

const layoutType1 = [[2, 1, 1], [1, 1, 1]];

interface AppContainerProps {}

interface AppContainerState {
    screenSize: Point;
    url: string[];
    grid: Point[][];
}

class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    moveXY: { ix: number | null; iy: number | null } = { ix: null, iy: null };
    contentRef: string[] = [];
    constructor(props: AppContainerProps) {
        super(props);
        this.onMove = this.onMove.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.state = {
            screenSize: new Point(0, 0),
            url: ['g0Nkx6zvIRg', 'nMc7s3xrLkY', '', '', '', '', '', '', ''],
            grid: this.initGrid(0, 0),
        };
    }

    initGrid(width: number, height: number): Point[][] {
        const grid: Point[][] = [];
        const lenX = 4;
        const lenY = 4;
        let tx = 0;
        let ty = 0;
        [2, 1].forEach((x, i, l1) => {
            const g: Point[] = [];
            ty = 0;
            [1, 1].forEach((y, j, l2) => {
                g.push(new Point((width / lenX) * (tx + x), (height / lenY) * (ty + y)));
                ty += y;
            });
            grid.push(g);
            tx += x;
        });
        console.log(grid);
        return grid;
    }

    componentDidMount() {
        const { width: width, height: height } = dom(this.refs.frame);

        this.setState({
            screenSize: new Point(width, height),
            grid: this.initGrid(width, height),
        });
    }

    render() {
        const prevGrid = this.state.grid;
        const f1 = prevGrid.filter((v, i) => i == 0).map((g, i) => g.map(p => new Point(0, p.y)));
        const f2 = prevGrid.map((g, i) => g.filter((v, i) => i == 0).map(p => new Point(p.x, 0)));

        const grid = [[new Point(0, 0)]].concat(f2);
        f1.forEach((v, i) => (grid[i] = grid[i].concat(v)));
        prevGrid.forEach((g, x) => (grid[x + 1] = grid[x + 1].concat(g)));

        const width = this.state.screenSize.x;
        const height = this.state.screenSize.y;
        const dragging = this.moveXY.ix != null || this.moveXY.iy != null;
        return (
            <div className="app-container" ref="frame">
                {grid.map((g, x, xl) => {
                    return g.map((p, y, yl) => {
                        return (
                            <div
                                className={`frame_box`}
                                style={{
                                    left: p.x,
                                    top: p.y,
                                }}
                                key={`f${x}${y}`}
                            >
                                {/* <iframe
                                    title="title1"
                                    className="iframe"
                                    width={this.getWidth(x, y, grid, width) - 16}
                                    height={this.getHeight(x, y, grid, height) - 16}
                                    key={p.x + '' + p.y + '_i'}
                                    ref={this.state.url[x * yl.length + y]}
                                    src={'https://www.youtube.com/embed/' + this.state.url[x * yl.length + y]}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                /> */}
                                <YouTube
                                    videoId={this.state.url[x * yl.length + y]}
                                    opts={{
                                        width: `${this.getWidth(x, y, grid, width) - 16}`,
                                        height: `${this.getHeight(x, y, grid, height) - 16}`,
                                        playerVars: {
                                            autoplay: undefined,
                                        },
                                    }}
                                />
                                <button
                                    className="btn btn-primary rounded-circle p-0"
                                    style={{
                                        position: 'absolute',
                                        width: '32px',
                                        height: '32px',
                                        right: '24px',
                                        top: '24px',
                                    }}
                                    key={p.x + '' + p.y + '_b'}
                                    onClick={this.close}
                                >
                                    ×
                                </button>
                            </div>
                        );
                    });
                })}
                {this.state.grid.map((g, x) => {
                    return g.map((p, y) =>
                        p.x == 0 || p.y == 0 ? null : (
                            <div
                                style={{
                                    left: p.x - 20,
                                    top: p.y - 20,
                                    backgroundColor: x == this.moveXY.ix && y == this.moveXY.iy ? '#FF0' : '#FFF',
                                }}
                                key={x + '' + y}
                                className="close_button"
                                onMouseDown={e => this.onEventChange(e, x, y)}
                                onMouseMove={e => this.onMove(e)}
                            />
                        ),
                    );
                })}
                {dragging ? <div id="drag_view" style={{ cursor: dragging ? 'move' : '' }} onMouseMove={e => this.onMove(e)} /> : null}
            </div>
        );
    }

    getWidth(x: number, y: number, grid: Point[][], displayWidth: number): number {
        const w = x < grid[0].length - 1 ? grid[x + 1][y].x - grid[x][y].x : displayWidth - grid[x][y].x;
        return w;
    }
    getHeight(x: number, y: number, grid: Point[][], displayHeight: number): number {
        const h = y < grid.length - 1 ? grid[x][y + 1].y - grid[x][y].y : displayHeight - grid[x][y].y;
        return h;
    }

    onEventChange(e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>, ix: number | null = null, iy: number | null = null) {
        // console.log('onEventChange', ix, iy);
        const dragging = this.moveXY.ix != null || this.moveXY.iy != null;
        if (dragging) {
            this.moveXY = { ix: null, iy: null };
        } else {
            this.moveXY = { ix: ix, iy: iy };
        }
        this.setState({});
    }

    onMove(e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // console.log('onMove', e.clientX, e.clientY);
        const grid = this.state.grid;
        if (this.moveXY.ix != null && this.moveXY.iy != null) {
            grid[this.moveXY.ix][this.moveXY.iy] = new Point(e.clientX, e.clientY);
        }
        this.setState({
            grid: grid,
        });
    }

    close() {
        console.log('close');
    }
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));
