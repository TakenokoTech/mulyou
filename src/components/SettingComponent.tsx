import React from 'react';
import { TwitterIcon } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Point from '../utils/Point';
import SearchModalComponent from './SearchModalComponent';
import GridModalComponent from './GridModalComponent';
import StockModalComponent from './StockModalComponent';
import './SettingComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faPlus,
    faVolumeMute,
    faVolumeUp,
    faVolumeDown,
    faPlay,
    faStop,
    faShare,
    faShareAlt,
    faChevronUp,
    faChevronDown,
    faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { dom } from '../dom.extension';
import Session, { SessionKey } from '../utils/Session';

interface SettingComponentProps {
    screenSize: Point;
    enable: boolean;
    layout: { x: number[]; y: number[] };
    addInputItem: (value: string) => void;
    addSearchItem: (item: YoutubeItem[]) => void;
    setLayout: (lx: number[], ly: number[]) => void;
    openSetting: () => void;
    closeSetting: () => void;
    makeLink: () => string;
    allVolumeUp: () => void;
    allVolumeDown: () => void;
    allStart: () => void;
    allStop: () => void;
}

interface SettingComponentState {
    clipurl: string;
    copied: boolean;
    searchEnable: boolean;
    stockEnable: boolean;
    gridEnable: boolean;
}

export default class SettingComponent extends React.Component<SettingComponentProps, SettingComponentState> {
    frame: HTMLElement | null = null;
    constructor(props: SettingComponentProps) {
        super(props);
        this.state = { clipurl: '', copied: false, searchEnable: false, stockEnable: false, gridEnable: false };
    }

    componentDidMount() {
        this.frame = document.getElementById('settingPanel');
    }

    render() {
        return (
            <>
                <div id="settingPanel" className={this.props.enable ? `enable` : `disable`} ref="frame">
                    <div
                        id="setting_header"
                        className={this.props.enable ? `enable` : `disable`}
                        onMouseDown={this.mouseDown}
                        onMouseUp={this.mouseUp}
                        onMouseLeave={this.mouseUp}
                        onMouseMove={this.onMove}
                    >
                        <button
                            id="settingPanelClose"
                            className="btn btn-light btn-sm"
                            onClick={() => {
                                this.props.enable ? this.props.closeSetting() : this.props.openSetting();
                            }}
                        >
                            {this.props.enable ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
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
                            </div>
                            <div>
                                <button type="button" className="btn btn-info ml-1" onClick={this.showSearch}>
                                    検索
                                </button>
                            </div>
                        </div>
                        <div style={{ fontSize: '18px', textAlign: 'center', paddingTop: '8px' }}>
                            <div style={{ paddingTop: '8px', display: 'inline-flex' }}>
                                <CopyToClipboard
                                    text={this.state.clipurl}
                                    onCopy={() => {
                                        alert(`[コピーしました]\n${this.props.makeLink()}`);
                                        this.setState({ copied: true });
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-info btn-sm btn-icon ml-1 mr-2"
                                        onClick={() => this.setState({ clipurl: this.props.makeLink() })}
                                    >
                                        {/* シェア */}
                                        <FontAwesomeIcon icon={faShareAlt} />
                                    </button>
                                </CopyToClipboard>
                                <button type="button" className="btn btn-success btn btn-icon ml-1" onClick={this.props.allVolumeDown}>
                                    {/* ミュート */}
                                    <FontAwesomeIcon icon={faVolumeDown} />
                                </button>
                                <button type="button" className="btn btn-success btn btn-icon ml-1" onClick={this.props.allVolumeUp}>
                                    {/* 音あり */}
                                    <FontAwesomeIcon icon={faVolumeUp} />
                                </button>
                                <button type="button" className="btn btn-primary btn btn-icon ml-1" onClick={this.props.allStart}>
                                    {/* 全再生 */}
                                    <FontAwesomeIcon icon={faPlay} />
                                </button>
                                <button type="button" className="btn btn-primary btn btn-icon ml-1" onClick={this.props.allStop}>
                                    {/* 全停止 */}
                                    <FontAwesomeIcon icon={faStop} />
                                </button>
                            </div>
                            <div style={{ paddingTop: '8px', display: 'inline-flex' }}>
                                <button type="button" className="btn btn-info btn ml-1 ml-3" onClick={this.showStock}>
                                    ストック
                                </button>
                                <button type="button" className="btn btn-info btn ml-1" onClick={this.showGrid}>
                                    グリッド
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <>
                    <SearchModalComponent
                        screenSize={this.props.screenSize}
                        addItem={this.props.addSearchItem}
                        enable={this.state.searchEnable}
                        close={() => this.setState({ searchEnable: false })}
                    />
                    <StockModalComponent
                        screenSize={this.props.screenSize}
                        enable={this.state.stockEnable}
                        close={() => this.setState({ stockEnable: false })}
                    />
                    <GridModalComponent
                        screenSize={this.props.screenSize}
                        layout={this.props.layout}
                        setLayout={this.props.setLayout}
                        enable={this.state.gridEnable}
                        close={() => this.setState({ gridEnable: false })}
                    />
                </>
                {/*
                <div className={'setting-frame ' + (this.props.enable ? 'enable' : 'disable')}>
                    <div className={'setting-overlay'} onClick={this.switchSetting} />
                    <div className="setting-base" onClick={() => {}}>
                        <button type="button" className="btn btn-icon setting-header-btn" onClick={this.switchSetting}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <div className="setting-header">Header</div>
                        <div className="setting-content">Header</div>
                        <div className="setting-footer">
                            <button type="button" className="btn btn-danger" onClick={this.switchSetting}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                */}
            </>
        );
    }

    switchSetting = () => {
        this.props.enable ? this.props.closeSetting() : this.props.openSetting();
    };

    dragging: boolean = false;
    offsetX: number | null = null;
    offsetY: number | null = null;

    mouseDown = (e: any) => {
        console.log('mouseDown');
        // this.dragging = true;
        // this.offsetX = e.pageX;
        // this.offsetY = e.pageY;
    };

    mouseUp = (e: any) => {
        console.log('mouseUp');
        // this.dragging = false;
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

    showSearch = () => {
        this.setState({ searchEnable: true });
    };

    showStock = () => {
        this.setState({ stockEnable: true });
    };

    showGrid = () => {
        this.setState({ gridEnable: true });
    };
}
