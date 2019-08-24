import React from 'react';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faVideo } from '@fortawesome/free-solid-svg-icons';
import './StockModalComponent.css';
import { relative } from 'path';
import { NowplayItem } from '../dom.extension';

interface StockModalComponentProps {
    screenSize: Point;
    enable: boolean;
    close: () => void;
}

interface StockModalComponentState {
    stock: YoutubeItem[];
    selectStock: YoutubeItem[];
    nowplay: NowplayItem[];
    selectNowplay: NowplayItem[];
    nowplayCount: number;
}

export default class StockModalComponent extends React.Component<StockModalComponentProps, StockModalComponentState> {
    constructor(props: StockModalComponentProps) {
        super(props);
        this.state = { nowplay: [], selectNowplay: [], stock: [], selectStock: [], nowplayCount: 0 };
    }

    componentDidMount() {}

    shouldComponentUpdate(nextProps: StockModalComponentProps, nextState: StockModalComponentState, nextContext: any) {
        const h = Session.load(SessionKey.HistoryItem);
        let stock = h ? (JSON.parse(h) as YoutubeItem[]) : [];
        const n = Session.load(SessionKey.NowPlayItem);
        let nowPlay = n ? (JSON.parse(n) as NowplayItem[]) : [];

        const gridLayout = Session.load(SessionKey.GridLayout);
        const l: { x: number[]; y: number[] } = gridLayout ? JSON.parse(gridLayout) : { x: [1, 1], y: [1, 1] };

        nextState.nowplay = nowPlay;
        nextState.nowplayCount = l.x.length * l.y.length;
        nextState.stock = stock;
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
                    <div className="setting-header">ストック一覧</div>
                    <div className="setting-content">
                        <ul className="list-unstyled">
                            {this.state.nowplay.map((item, i) =>
                                item ? (
                                    <li key={i} className="media my-4" onClick={() => this.selectNowplayItem(item)} style={{ cursor: 'pointer' }}>
                                        <div
                                            className="mr-3"
                                            style={{
                                                position: 'relative',
                                                border: this.nowPlayBorderStyle(item),
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <div className="nowplay_li">
                                                <div className="nowplay_no">{i + 1}</div>
                                                <FontAwesomeIcon icon={faVideo} className="nowplay_icon" />
                                                <div className="nowplay_text">{i < this.state.nowplayCount ? '再生中' : '割込'}</div>
                                            </div>
                                        </div>
                                        <div className="media-body" style={{ textAlign: 'left', paddingTop: '4px' }}>
                                            <b>{item ? item.title : ''}</b>
                                        </div>
                                    </li>
                                ) : null,
                            )}
                            {this.state.stock.map((item, i) => {
                                return (
                                    <li key={i} className="media my-4" onClick={() => this.selectStockItem(item)} style={{ cursor: 'pointer' }}>
                                        <div
                                            className="mr-3"
                                            style={{
                                                position: 'relative',
                                                border: this.stockBorderStyle(item),
                                                borderRadius: '8px',
                                            }}
                                        >
                                            <img
                                                src={item.snippet.thumbnails.high.url}
                                                alt="Generic placeholder image"
                                                width="120"
                                                style={{ borderRadius: '4px' }}
                                            />
                                            <div className="stock_no">{i + this.state.nowplay.length + 1}</div>
                                        </div>
                                        <div className="media-body" style={{ textAlign: 'left' }}>
                                            <b>{item.snippet.title}</b>
                                            <br />
                                            {item.snippet.description}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="setting-footer">
                        <button type="button" className="btn ml-1 setting-button" style={{ width: '80px' }} onClick={this.props.close}>
                            {'Close'}
                        </button>
                        <button type="button" className="btn ml-1 setting-button negative" style={{ width: '80px' }} onClick={e => this.deleteStock()}>
                            {'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    nowPlayBorderStyle = (item: NowplayItem): string => {
        return this.state.selectNowplay.map(i => i.videoId).indexOf(item.videoId) > -1 ? '4px solid #dc3545CC' : '4px solid #FF000000';
    };

    stockBorderStyle = (item: YoutubeItem): string => {
        return this.state.selectStock.map(i => i.id.videoId).indexOf(item.id.videoId) > -1 ? '4px solid #dc3545CC' : '4px solid #FF000000';
    };

    private selectNowplayItem = (item: NowplayItem) => {
        let select = this.state.selectNowplay;
        if (select.map(i => i.videoId).indexOf(item.videoId) > -1) {
            select = select.filter(i => i.videoId != item.videoId);
        } else {
            select = select.concat(item);
        }
        this.setState({
            selectNowplay: select,
        });
    };

    private selectStockItem = (item: YoutubeItem) => {
        let select = this.state.selectStock;
        if (select.map(i => i.id.videoId).indexOf(item.id.videoId) > -1) {
            select = select.filter(i => i.id.videoId != item.id.videoId);
        } else {
            select = select.concat(item);
        }
        this.setState({
            selectStock: select,
        });
    };

    private deleteStock = () => {
        let stock = this.state.stock;
        let select = this.state.selectStock;
        stock = stock.filter(i => select.map(s => s.id.videoId).indexOf(i.id.videoId) == -1);
        Session.save(SessionKey.HistoryItem, JSON.stringify(stock));
        this.setState({
            stock: stock,
            selectStock: [],
        });
    };
}
