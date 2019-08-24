import React from 'react';
import queryString, { ParsedQuery } from 'query-string';
import './AppContainer.css';
import { dom, NowplayItem } from '../dom.extension';
import Point from '../utils/Point';
import MadiaComponent from '../components/MediaComponent';
import DragComponent from '../components/DragComponent';
import Session, { SessionKey } from '../utils/Session';
import SettingComponent from '../components/SettingComponent';
import { MapDispatchProps } from './BindingAppContainer';
import { StoreState } from '../store/types';

interface AppContainerProps extends MapDispatchProps, StoreState {
    query: ParsedQuery<string>;
}

interface AppContainerState {
    moveXY: { ix: number | null; iy: number | null };
    grid: { [key: string]: { [key: string]: Point } };
}

export class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
    constructor(props: AppContainerProps) {
        super(props);
        this.state = { moveXY: { ix: null, iy: null }, grid: {} };
    }

    componentDidMount() {
        console.log('app.componentDidMount');

        const { width: width, height: height } = dom(this.refs.frame);
        this.props.setScreenSize(new Point(width, height - 32));
    }

    shouldComponentUpdate(nextProps: AppContainerProps, nextState: AppContainerState, nextContext: any) {
        console.log('shouldComponentUpdate', nextProps, nextState);
        Session.save(SessionKey.NowPlayItem, JSON.stringify(nextProps.nowplay));
        for (const n in nextProps.nowplay) {
            const size = nextProps.layout.x.length * nextProps.layout.y.length;
            if (nextProps.nowplay[n] == null && nextProps.nowplay.length > size) this.props.nextContents(+n);
        }
        return true;
    }

    render() {
        const temp = this.initGrid();
        const prevGrid = this.initGrid();
        const f1 = prevGrid.filter((v, i) => i == 0).map((g, i) => g.map(p => new Point(0, p.y)));
        const f2 = prevGrid.map((g, i) => g.filter((v, i) => i == 0).map(p => new Point(p.x, 0)));

        const grid = [[new Point(0, 0)]].concat(f2);
        f1.forEach((v, i) => (grid[i] = grid[i].concat(v)));
        prevGrid.forEach((g, x) => (grid[x + 1] = grid[x + 1].concat(g)));

        const width = this.props.screenSize.x;
        const height = this.props.screenSize.y;
        const dragging = this.state.moveXY.ix != null || this.state.moveXY.iy != null;
        return (
            <div className="app-container" ref="frame">
                {grid.map((g, x, xl) => {
                    return g.map((p, y, yl) => {
                        const index = x * yl.length + y;
                        const videoId = (this.props.nowplay[index] || { videoId: '' }).videoId || null;
                        return (
                            <MadiaComponent
                                screenSize={this.props.screenSize}
                                key={`f${x}${y}`}
                                videoId={videoId}
                                height={this.getHeight(x, y, grid, height) - 8}
                                width={this.getWidth(x, y, grid, width) - 8}
                                left={p.x}
                                top={p.y}
                                setting={this.props.setting}
                                bulkVolume={this.props.bulkVolume}
                                bulkPlay={this.props.bulkPlay}
                                onReady={title => this.props.setTitle(index, title)}
                                onEnd={() => this.props.nextContents(index)}
                            />
                        );
                    });
                })}
                {temp.map((g, x) => {
                    return g.map((p, y) => {
                        const dragging = x == this.state.moveXY.ix && y == this.state.moveXY.iy;
                        return p.x == 0 || p.y == 0 || !this.props.setting ? null : (
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
                {this.props.setting ? (
                    <div id="drag_view" style={{ cursor: dragging ? 'move' : '' }} onMouseMove={this.onMove} onClick={this.onEventChange} />
                ) : null}
                <SettingComponent
                    screenSize={this.props.screenSize}
                    enable={this.props.setting}
                    layout={this.props.layout}
                    resize={this.resize}
                    addInputItem={this.props.addItemFromText}
                    addSearchItem={this.props.addItemFromSearch}
                    setLayout={this.props.setLayout}
                    openSetting={this.props.openSetting}
                    closeSetting={this.props.closeSetting}
                    makeLink={this.makeLink}
                    allVolumeDown={this.props.allVolumeDown}
                    allVolumeUp={this.props.allVolumeUp}
                    allStart={this.props.allStart}
                    allStop={this.props.allStop}
                />
            </div>
        );
    }

    private initGrid(): Point[][] {
        const width = this.props.screenSize.x;
        const height = this.props.screenSize.y;
        const lx = this.props.layout.x;
        const ly = this.props.layout.y;
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

    private getWidth = (x: number, y: number, grid: Point[][], displayWidth: number): number => {
        return grid[x + 1] && grid[x + 1].length > 0 ? grid[x + 1][y].x - grid[x][y].x : displayWidth - grid[x][y].x;
    };

    private getHeight = (x: number, y: number, grid: Point[][], displayHeight: number): number => {
        return grid[x][y + 1] ? grid[x][y + 1].y - grid[x][y].y : displayHeight - grid[x][y].y;
    };

    private onEventChange = (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>, ix: number | null = null, iy: number | null = null) => {
        // console.log('onEventChange', e.clientX, e.clientY);
        const dragging = this.state.moveXY.ix != null || this.state.moveXY.iy != null;
        this.setState({ moveXY: dragging ? { ix: null, iy: null } : { ix: ix, iy: iy } });
    };

    private onMove = (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const grid = this.state.grid;
        if (this.state.moveXY.ix != null && this.state.moveXY.iy != null) {
            // console.log('onMove', e.clientX, e.clientY);
            grid[this.state.moveXY.ix] = grid[this.state.moveXY.ix] ? grid[this.state.moveXY.ix] : {};
            grid[this.state.moveXY.ix][this.state.moveXY.iy] = new Point(e.clientX, e.clientY);
            this.setState({ grid: grid });
        }
    };

    private makeLink = (): string => {
        const url = `${location.origin}?${queryString.stringify({ v: this.props.nowplay.map(v => (v ? v.videoId : '')) }, { arrayFormat: 'comma' })}`;
        console.log(url);
        return url;
    };

    private resize = () => {
        console.log('resize');
        const { width: width, height: height } = dom(this.refs.frame);
        this.props.setScreenSize(new Point(width, height - 32));
    };
}
