import React from 'react';
import ReactDOM from 'react-dom';
import YouTube from 'react-youtube';
import './App.css';
import { dom, CustomMouseEvent } from './dom.extension';
import Point from './utils/Point';
import { number } from 'prop-types';
import MadiaComponent from './components/MediaComponent';
import DragComponent from './components/DragComponent';
import ModalComponent from './components/SearchModalComponent';
import GridModalComponent from './components/GridModalComponent';
import Session, { SessionKey } from './utils/Session';

const layoutType1 = [[2, 1, 1], [1, 1, 1]];

interface AppContainerProps {}

interface AppContainerState {
    screenSize: Point;
    url: string[];
    moveXY: { ix: number | null; iy: number | null };
    setting: boolean;
    layout: { x: number[]; y: number[] };
}

class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props: AppContainerProps) {
        super(props);
        this.onMove = this.onMove.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.addURL = this.addURL.bind(this);

        const gridLayout = Session.load(SessionKey.GridLayout);
        const l = gridLayout ? JSON.parse(gridLayout) : { x: [1], y: [1] };
        this.state = {
            screenSize: new Point(0, 0),
            url: ['uXYXC0jaN74', 'Y8XpPA4jCts', 'vi3AR3T70lE', '8GbAsgrEpS0'],
            moveXY: { ix: null, iy: null },
            setting: true,
            layout: { x: l.x || [], y: l.y || [] },
        };
    }

    initGrid(): Point[][] {
        const width = this.state.screenSize.x;
        const height = this.state.screenSize.y;
        const lx = this.state.layout.x;
        const ly = this.state.layout.y;
        const grid: Point[][] = [];
        const lenX = lx.reduce((a, x) => (a += x), 0);
        const lenY = ly.reduce((a, y) => (a += y), 0);
        let tx = 0;
        let ty = 0;
        lx.forEach((x, i, l1) => {
            const g: Point[] = [];
            ty = 0;
            if (l1.length - 1 != i) {
                ly.forEach((y, j, l2) => {
                    if (l2.length - 1 != j) {
                        g.push(new Point((width / lenX) * (tx + x), (height / lenY) * (ty + y)));
                    }
                    ty += y;
                });
                grid.push(g);
            }
            tx += x;
        });
        console.log(grid);
        return grid;
    }

    componentDidMount() {
        const { width: width, height: height } = dom(this.refs.frame);

        this.setState({
            screenSize: new Point(width, height),
        });

        // document.onkeydown = e => {
        //     if (e.code == 'Space') {
        //         this.setState({ setting: !this.state.setting });
        //     }
        // };

        window.addEventListener('resize', () => {
            const { width: width, height: height } = dom(this.refs.frame);
            this.setState({
                screenSize: new Point(width, height),
            });
        });
    }

    render() {
        const temp = this.initGrid();
        const prevGrid = this.initGrid();
        const f1 = prevGrid.filter((v, i) => i == 0).map((g, i) => g.map(p => new Point(0, p.y)));
        const f2 = prevGrid.map((g, i) => g.filter((v, i) => i == 0).map(p => new Point(p.x, 0)));

        const grid = [[new Point(0, 0)]].concat(f2);
        f1.forEach((v, i) => (grid[i] = grid[i].concat(v)));
        prevGrid.forEach((g, x) => (grid[x + 1] = grid[x + 1].concat(g)));

        const width = this.state.screenSize.x;
        const height = this.state.screenSize.y;
        const dragging = this.state.moveXY.ix != null || this.state.moveXY.iy != null;
        return (
            <div className="app-container" ref="frame">
                {grid.map((g, x, xl) => {
                    return g.map((p, y, yl) => {
                        const index = x * yl.length + y;
                        return (
                            <MadiaComponent
                                screenSize={this.state.screenSize}
                                key={`f${x}${y}`}
                                videoId={this.state.url[index]}
                                height={this.getHeight(x, y, grid, height) - 8}
                                width={this.getWidth(x, y, grid, width) - 8}
                                left={p.x}
                                top={p.y}
                                setting={this.state.setting}
                                onClose={() => this.removeURL(this.state.url[index])}
                            />
                        );
                    });
                })}
                {temp.map((g, x) => {
                    return g.map((p, y) => {
                        const dragging = x == this.state.moveXY.ix && y == this.state.moveXY.iy;
                        return p.x == 0 || p.y == 0 ? null : (
                            <DragComponent
                                moveXY={this.state.moveXY}
                                indexX={x}
                                indexY={y}
                                key={`drag${x}${y}`}
                                dragKey={`drag${x}${y}`}
                                left={p.x - 12}
                                top={p.y - 12}
                                color={dragging ? '#FF0' : '#FFF'}
                                onEventChange={this.onEventChange}
                                onMove={this.onMove}
                            />
                        );
                    });
                })}
                {dragging ? (
                    <div
                        id="drag_view"
                        style={{
                            cursor: dragging ? 'move' : '',
                        }}
                        onMouseMove={e => this.onMove(e)}
                    />
                ) : null}
                {this.state.setting ? (
                    <div
                        id="settingPanel"
                        style={{
                            left: width / 2 - 300,
                        }}
                    >
                        <div className="input-group">
                            <input type="text" className="form-control" ref="inputVideo" placeholder="Video ID" aria-label="Video ID" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={e => this.addURL()}>
                                    ADD
                                </button>
                                　
                                <ModalComponent screenSize={this.state.screenSize} addURL={this.addURL} />
                            </div>
                        </div>
                        <div style={{ fontSize: '18px', textAlign: 'right', padding: '8px 0px' }}>
                            <div style={{ position: 'absolute' }}>
                                {/* grid: {JSON.stringify(this.grid(this.state.url))} {`  `} url: {this.state.url.length} */}
                            </div>
                            <GridModalComponent screenSize={this.state.screenSize} setLayout={this.setLayout} />
                        </div>
                        <button id="settingPanelClose" className="btn btn-light">
                            close
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }

    private getWidth(x: number, y: number, grid: Point[][], displayWidth: number): number {
        return grid[x + 1] ? grid[x + 1][y].x - grid[x][y].x : displayWidth - grid[x][y].x;
    }

    private getHeight(x: number, y: number, grid: Point[][], displayHeight: number): number {
        return grid[x][y + 1] ? grid[x][y + 1].y - grid[x][y].y : displayHeight - grid[x][y].y;
    }

    private onEventChange(e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>, ix: number | null = null, iy: number | null = null) {
        console.log('onEventChange', e.clientX, e.clientY);
        const dragging = this.state.moveXY.ix != null || this.state.moveXY.iy != null;
        this.setState({ moveXY: dragging ? { ix: null, iy: null } : { ix: ix, iy: iy } });
    }

    private onMove(e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log('onMove', e.clientX, e.clientY);
        // const grid = this.state.grid;
        // if (this.state.moveXY.ix != null && this.state.moveXY.iy != null) {
        //     grid[this.state.moveXY.ix][this.state.moveXY.iy] = new Point(e.clientX, e.clientY);
        // }
        // this.setState({
        //     grid: grid,
        // });
    }

    private addURL(url: string[] | null = null) {
        const value = (this.refs.inputVideo as HTMLInputElement).value;
        if (url == null && value == '') return;
        url = url || [value];
        const newUrl = this.state.url.concat(url);
        this.setState({
            url: newUrl,
        });
    }

    private removeURL(url: string) {
        const newUrl = this.state.url.filter(n => n != url);
        this.setState({
            url: newUrl,
        });
    }

    setLayout = (lx: number[], ly: number[]) => {
        Session.save(SessionKey.GridLayout, JSON.stringify({ x: lx, y: ly }));
        this.setState({
            layout: { x: lx, y: ly },
        });
    };

    private grid = (newUrl: string[]): [number[], number[]] => {
        const len = newUrl.length;
        if (len >= 10) {
            return [[1, 1, 1], [1, 1, 1, 1]];
        } else if (len >= 9) {
            return [[1, 1, 1], [1, 1, 1]];
        } else if (len >= 7) {
            return [[1, 1], [1, 1, 1, 1]];
        } else if (len >= 5) {
            return [[1, 1], [1, 1, 1]];
        } else if (len >= 3) {
            return [[1, 1], [1, 1]];
        } else if (len >= 2) {
            return [[1], [1, 1]];
        } else if (len == 1) {
            return [[1], [1]];
        } else {
            return [[], []];
        }
    };
}

ReactDOM.render(<AppContainer />, document.getElementById('root'));
