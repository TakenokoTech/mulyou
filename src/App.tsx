import React from 'react';
import ReactDOM from 'react-dom';
import queryString, { ParsedQuery } from 'query-string';
import './App.css';
import { dom } from './dom.extension';
import Point from './utils/Point';
import MadiaComponent from './components/MediaComponent';
import DragComponent from './components/DragComponent';
import Session, { SessionKey } from './utils/Session';
import SettingComponent from './components/SettingComponent';
import { Location } from 'history';

interface AppContainerProps {
    query: ParsedQuery<string>;
}

interface AppContainerState {
    screenSize: Point;
    url: (string | null)[];
    moveXY: { ix: number | null; iy: number | null };
    setting: boolean;
    layout: { x: number[]; y: number[] };
    bulkPlay: boolean;
    bulkVolume: number;
}

export class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props: AppContainerProps) {
        super(props);
        this.onEventChange = this.onEventChange.bind(this);

        const gridLayout = Session.load(SessionKey.GridLayout);
        const l = gridLayout ? JSON.parse(gridLayout) : { x: [1, 1], y: [1, 1] };

        const item = Session.load(SessionKey.NowPlayItem);
        const v = this.props.query.v;

        this.state = {
            screenSize: new Point(0, 0),
            url: v ? v : item ? JSON.parse(item) : ['uXYXC0jaN74', 'Y8XpPA4jCts', 'vi3AR3T70lE', '8GbAsgrEpS0'],
            moveXY: { ix: null, iy: null },
            setting: false,
            layout: { x: l.x || [], y: l.y || [] },
            bulkPlay: false,
            bulkVolume: 0,
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
                    if (l2.length - 1 != j) g.push(new Point((width / lenX) * (tx + x), (height / lenY) * (ty + y)));
                    ty += y;
                });
                grid.push(g);
            }
            tx += x;
        });
        return grid;
    }

    componentDidMount() {
        console.log('app.componentDidMount');
        const { width: width, height: height } = dom(this.refs.frame);
        window.addEventListener('resize', () => {
            const { width: width, height: height } = dom(this.refs.frame);
            this.setState({
                screenSize: new Point(width, height),
            });
        });

        this.setState({
            screenSize: new Point(width, height - 32),
        });
    }

    shouldComponentUpdate(nextProps: AppContainerProps, nextState: AppContainerState, nextContext: any) {
        // console.log(nextState.url);
        Session.save(SessionKey.NowPlayItem, JSON.stringify(nextState.url));
        return true;
    }

    render() {
        // console.log('app.render', this.state);
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
                                bulkVolume={this.state.bulkVolume}
                                bulkPlay={this.state.bulkPlay}
                                onEnd={() => this.next(index)}
                            />
                        );
                    });
                })}
                {temp.map((g, x) => {
                    return g.map((p, y) => {
                        const dragging = x == this.state.moveXY.ix && y == this.state.moveXY.iy;
                        return p.x == 0 || p.y == 0 || !this.state.setting ? null : (
                            <DragComponent
                                moveXY={this.state.moveXY}
                                indexX={x}
                                indexY={y}
                                key={`drag${x}${y}`}
                                dragKey={`drag${x}${y}`}
                                left={p.x - 12}
                                top={p.y - 12}
                                color={dragging ? '#FF01' : '#FFF1'}
                                onEventChange={this.onEventChange}
                                onMove={this.onMove}
                            />
                        );
                    });
                })}
                {this.state.setting ? <div id="drag_view" style={{ cursor: dragging ? 'move' : '' }} onMouseMove={e => this.onMove(e)} /> : null}
                <SettingComponent
                    screenSize={this.state.screenSize}
                    enable={this.state.setting}
                    layout={this.state.layout}
                    addInputItem={this.addInputItem}
                    addSearchItem={this.addSearchItem}
                    setLayout={this.setLayout}
                    openSetting={this.openSetting}
                    closeSetting={this.closeSetting}
                    makeLink={this.makeLink}
                    allVolumeDown={this.allVolumeDown}
                    allVolumeUp={this.allVolumeUp}
                    allStart={this.allStart}
                    allStop={this.allStop}
                />
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
        !this.state.setting ? this.openSetting() : this.closeSetting();
        this.setState({ moveXY: dragging ? { ix: null, iy: null } : { ix: ix, iy: iy } });
    }

    private onMove = (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // console.log('onMove', e.clientX, e.clientY);
        // const grid = this.state.grid;
        // if (this.state.moveXY.ix != null && this.state.moveXY.iy != null) {
        //     grid[this.state.moveXY.ix][this.state.moveXY.iy] = new Point(e.clientX, e.clientY);
        // }
        // this.setState({
        //     grid: grid,
        // });
    };

    private addInputItem = (value: string) => (value != '' ? this.setState({ url: this.state.url.concat([value]) }) : null);

    private addSearchItem = (item: YoutubeItem[]) => {
        this.state.url.forEach((v, i) => {
            if (v == null) {
                const it = item.shift();
                this.state.url[i] = it ? it.id.videoId : null;
                this.setState({ url: this.state.url });
            }
        });

        const h = Session.load(SessionKey.HistoryItem);
        let historyItem = h ? (JSON.parse(h) as YoutubeItem[]) : [];
        historyItem = historyItem.concat(item);
        Session.save(SessionKey.HistoryItem, JSON.stringify(historyItem));

        const count = this.state.layout.x.length * this.state.layout.y.length;
        const len = this.state.url.length;
        for (let index = 0; index < count; index++) {
            if (len <= index) this.next(index);
        }
    };

    private next = (index: number) => {
        console.log(`next ${index}`);
        const count = this.state.layout.x.length * this.state.layout.y.length;
        const len = this.state.url.length;
        if (count < len) {
            this.state.url[index] = this.state.url[count];
            this.state.url.splice(count, 1);
            this.setState({ url: this.state.url });
            return;
        }

        const h = Session.load(SessionKey.HistoryItem);
        let stock = h ? (JSON.parse(h) as YoutubeItem[]) : [];
        if (stock.length > 0) {
            this.state.url[index] = stock[0].id.videoId;
            Session.save(SessionKey.HistoryItem, JSON.stringify(stock.slice(1)));
        } else {
            this.state.url[index] = null;
        }
        this.setState({ url: this.state.url });
    };

    private setLayout = (lx: number[], ly: number[]) => {
        Session.save(SessionKey.GridLayout, JSON.stringify({ x: lx, y: ly }));
        this.setState({ layout: { x: lx, y: ly } });
    };

    private makeLink = (): string => `${location.origin}?${queryString.stringify({ v: this.state.url }, { arrayFormat: 'comma' })}`;
    private allVolumeDown = () => this.setState({ bulkVolume: Math.max(this.state.bulkVolume - 10, 0) });
    private allVolumeUp = () => this.setState({ bulkVolume: Math.min(this.state.bulkVolume + 10, 100) });
    private allStart = () => this.setState({ bulkPlay: true });
    private allStop = () => this.setState({ bulkPlay: false });
    private openSetting = () => this.setState({ setting: true });
    private closeSetting = () => this.setState({ setting: false });
}
