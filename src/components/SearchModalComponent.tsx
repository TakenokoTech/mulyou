import React from 'react';
import { gapi } from '../utils/gapi';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';

interface SearchModalComponentProps {
    screenSize: Point;
    addItem: (item: YoutubeItem[]) => void;
}

interface SearchModalComponentState {
    result: YoutubeItem[];
    select: YoutubeItem[];
    history: {
        q: string;
        nextPageToken: string;
    };
}

export default class SearchModalComponent extends React.Component<SearchModalComponentProps, SearchModalComponentState> {
    constructor(props: SearchModalComponentProps) {
        super(props);
        this.state = { result: [], select: [], history: { q: '', nextPageToken: '' } };
    }

    componentDidMount() {
        const q = Session.load(SessionKey.HistoryWord);
        if (q != null && q != '') {
            (this.refs.searchText as HTMLInputElement).value = q;
            // this.search(null);
        }
    }

    render() {
        return (
            <div className="modal fade" id="searchModal" ref="modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                コンテンツ検索
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <input type="text" className="form-control" ref="searchText" placeholder="チャンネル名, 動画名, etc..." aria-label="Video ID" />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={e => this.search(e)}>
                                        検索
                                    </button>
                                </div>
                            </div>
                            <ul className="list-unstyled" style={{ height: this.props.screenSize.y * 0.7, overflowY: 'scroll' }}>
                                {this.state.result
                                    ? this.state.result.map((item, i) => {
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
                                                  <div className="media-body">
                                                      <b>{item.snippet.title}</b>
                                                      <br />
                                                      {item.snippet.description}
                                                  </div>
                                              </li>
                                          );
                                      })
                                    : null}
                                {this.state.history.q != '' ? (
                                    <li className="media my-4">
                                        <button className="btn mx-auto" onClick={this.next}>
                                            Next
                                        </button>
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={this.add}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private search = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
        const text = (this.refs.searchText as HTMLInputElement).value;
        Session.save(SessionKey.HistoryWord, text);

        const fetchVideo = await YoutubeApi.fetchVideo(text);
        const nextPageToken = fetchVideo.nextPageToken;
        const items = fetchVideo.items;
        const yitem = items.map((v: any) => {
            return v as YoutubeItem;
        });
        this.setState({
            history: {
                q: text,
                nextPageToken: nextPageToken,
            },
            result: yitem,
        });
    };

    private next = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
        const text = this.state.history.q;
        const token = this.state.history.nextPageToken;
        const fetchVideo = await YoutubeApi.fetchVideo(text, token);
        const nextPageToken = fetchVideo.nextPageToken;
        const items = fetchVideo.items;
        const yitem = items.map((v: any) => {
            return v as YoutubeItem;
        });
        this.setState({
            history: {
                q: text,
                nextPageToken: nextPageToken,
            },
            result: this.state.result.concat(yitem),
        });
    };

    private selectItem = async (item: YoutubeItem) => {
        console.log(SessionKey.HistoryWord, item);
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

    private add = () => {
        this.props.addItem(this.state.select);
        $('#searchModal').modal('hide');
        this.setState({
            select: [],
        });
    };
}
