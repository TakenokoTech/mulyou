import React from 'react';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface StockModalComponentProps {
    screenSize: Point;
    enable: boolean;
    close: () => void;
}

interface StockModalComponentState {
    stock: YoutubeItem[];
    select: YoutubeItem[];
}

export default class StockModalComponent extends React.Component<StockModalComponentProps, StockModalComponentState> {
    constructor(props: StockModalComponentProps) {
        super(props);
        this.state = { stock: [], select: [] };
    }

    componentDidMount() {}

    shouldComponentUpdate(nextProps: StockModalComponentProps, nextState: StockModalComponentState, nextContext: any) {
        const h = Session.load(SessionKey.HistoryItem);
        let stock = h ? (JSON.parse(h) as YoutubeItem[]) : [];
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
                            {this.state.stock.map((item, i) => {
                                return (
                                    <li key={i} className="media my-4" onClick={() => this.selectItem(item)} style={{ cursor: 'pointer' }}>
                                        <img
                                            className="mr-3"
                                            src={item.snippet.thumbnails.high.url}
                                            alt="Generic placeholder image"
                                            width="120"
                                            style={{
                                                border:
                                                    this.state.select.map(i => i.id.videoId).indexOf(item.id.videoId) > -1
                                                        ? '4px solid #FF0000CC'
                                                        : '4px solid #FF000000',
                                            }}
                                        />
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
                        <button type="button" className="btn btn-secondary ml-1" style={{ width: '80px' }} onClick={this.props.close}>
                            {'Close'}
                        </button>
                        <button type="button" className="btn btn-danger ml-1" style={{ width: '80px' }} onClick={e => this.deleteStock()}>
                            {'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private selectItem = (item: YoutubeItem) => {
        console.log('selete');
        let select = this.state.select;
        if (select.map(i => i.id).indexOf(item.id) > -1) {
            select = select.filter(i => i.id != item.id);
        } else {
            select = select.concat(item);
        }
        this.setState({
            select: select,
        });
    };

    private deleteStock = () => {
        let stock = this.state.stock;
        let select = this.state.select;
        stock = stock.filter(i => select.map(s => s.id.videoId).indexOf(i.id.videoId) == -1);
        Session.save(SessionKey.HistoryItem, JSON.stringify(stock));
        this.setState({
            stock: stock,
            select: [],
        });
    };
}
