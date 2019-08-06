import React from 'react';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';

interface StockModalComponentProps {
    screenSize: Point;
    stock: YoutubeItem[];
}

interface StockModalComponentState {}

export default class StockModalComponent extends React.Component<StockModalComponentProps, StockModalComponentState> {
    constructor(props: StockModalComponentProps) {
        super(props);
        this.state = { result: [], select: [], history: { q: '', nextPageToken: '' } };
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <button
                    type="button"
                    className="btn btn-info ml-1"
                    onClick={() => {
                        $('#stockModal').modal('show');
                    }}
                >
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
                                    {this.props.stock.map((item, i) => {
                                        return (
                                            <li
                                                key={i}
                                                className="media my-4"
                                                onClick={() => {} /*this.selectItem(item.id.videoId)*/}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    className="mr-3"
                                                    src={item.snippet.thumbnails.high.url}
                                                    alt="Generic placeholder image"
                                                    width="120"
                                                    style={{}}
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
                                <button type="button" className="btn btn-danger">
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
}
