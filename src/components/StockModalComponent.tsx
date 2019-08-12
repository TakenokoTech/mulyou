import React from 'react';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';

interface StockModalComponentProps {
    screenSize: Point;
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

    render() {
        return (
            <>
                <button type="button" className="btn btn-info btn-sm ml-1" onClick={this.show}>
                    ストック
                </button>
                <div className="modal fade" id="stockModal" ref="modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    ストック一覧
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-unstyled" style={{ height: this.props.screenSize.y * 0.7, overflowY: 'scroll' }}>
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
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={e => this.deleteStock()}>
                                    Delete
                                </button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    show = () => {
        const h = Session.load(SessionKey.HistoryItem);
        let stock = h ? (JSON.parse(h) as YoutubeItem[]) : [];
        this.setState({ stock: stock });
        $('#stockModal').modal('show');
    };

    private selectItem = (item: YoutubeItem) => {
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
        stock = stock.filter(i => select.indexOf(i) == -1);
        Session.save(SessionKey.HistoryItem, JSON.stringify(stock));
        this.setState({
            stock: stock,
            select: [],
        });
    };
}
