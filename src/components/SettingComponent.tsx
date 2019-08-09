import React from 'react';
import Point from '../utils/Point';
import ModalComponent from './SearchModalComponent';
import GridModalComponent from './GridModalComponent';
import StockModalComponent from './StockModalComponent';
import './SettingComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faVolumeMute, faVolumeUp, faVolumeDown, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { dom } from '../dom.extension';

interface SettingComponentProps {
    screenSize: Point;
    layout: { x: number[]; y: number[] };
    addInputItem: (value: string) => void;
    addSearchItem: (item: YoutubeItem[]) => void;
    setLayout: (lx: number[], ly: number[]) => void;
    closeSetting: () => void;
    allVolumeUp: () => void;
    allVolumeDown: () => void;
    allStart: () => void;
    allStop: () => void;
}

interface SettingComponentState {}

export default class SettingComponent extends React.Component<SettingComponentProps, SettingComponentState> {
    frame: HTMLElement | null = null;
    constructor(props: SettingComponentProps) {
        super(props);
    }

    componentDidMount() {
        console.log(this.refs.frame);
        this.frame = document.getElementById('settingPanel');
    }

    render() {
        return (
            <div id="settingPanel" ref="frame">
                <div id="setting_header" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseLeave={this.mouseUp} onMouseMove={this.onMove}>
                    設定
                    <button id="settingPanelClose" className="btn btn-light btn-sm" onClick={this.props.closeSetting}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div id="setting_content">
                    <div className="input-group">
                        <input type="text" className="form-control" ref="inputVideo" placeholder="Video ID" aria-label="Video ID" />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={e => this.props.addInputItem((this.refs.inputVideo as HTMLInputElement).value)}
                            >
                                {/* ADD　 */}
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <ModalComponent screenSize={this.props.screenSize} addItem={this.props.addSearchItem} />
                        </div>
                    </div>
                    <div style={{ fontSize: '18px', textAlign: 'right', padding: '8px 0px' }}>
                        <button type="button" className="btn btn-success btn-sm ml-1" onClick={this.props.allVolumeDown}>
                            {/* ミュート */}
                            {'　'} <FontAwesomeIcon icon={faVolumeDown} /> {'　'}
                        </button>
                        <button type="button" className="btn btn-success btn-sm ml-1" onClick={this.props.allVolumeUp}>
                            {/* 音あり */}
                            {'　'} <FontAwesomeIcon icon={faVolumeUp} /> {'　'}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm ml-1" onClick={this.props.allStart}>
                            {/* 全再生 */}
                            {'　'} <FontAwesomeIcon icon={faPlay} /> {'　'}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm ml-1 mr-3" onClick={this.props.allStop}>
                            {/* 全停止 */}
                            {'　'} <FontAwesomeIcon icon={faStop} /> {'　'}
                        </button>
                        <StockModalComponent screenSize={this.props.screenSize} />
                        <GridModalComponent screenSize={this.props.screenSize} layout={this.props.layout} setLayout={this.props.setLayout} />
                    </div>
                </div>
            </div>
        );
    }

    dragging: boolean = false;
    offsetX: number | null = null;
    offsetY: number | null = null;

    mouseDown = (e: any) => {
        console.log('mouseDown');
        this.dragging = true;
        this.offsetX = e.pageX;
        this.offsetY = e.pageY;
    };

    mouseUp = (e: any) => {
        console.log('mouseUp');
        this.dragging = false;
    };

    onMove = (e: any) => {
        if (this.dragging && this.offsetX && this.offsetY) {
            const x = e.pageX - this.offsetX;
            const y = e.pageY - this.offsetY;
            this.offsetX = e.pageX;
            this.offsetY = e.pageY;
            this.frame && (this.frame.style.height = this.frame.offsetHeight + 'px');
            this.frame && (this.frame.style.top = this.frame.offsetTop + y + 'px');
            this.frame && (this.frame.style.left = this.frame.offsetLeft + x + 'px');
        }
    };
}
