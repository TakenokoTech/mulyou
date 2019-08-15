import React from 'react';
import Session, { SessionKey } from '../utils/Session';
import Point from '../utils/Point';
import * as YoutubeApi from '../repository/YoutubeApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface SearchModalComponentProps {
    screenSize: Point;
    addItem: (item: YoutubeItem[]) => void;
    enable: boolean;
    close: () => void;
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
            <div className={'setting-frame ' + (this.props.enable ? 'enable' : 'disable')}>
                <div className={'setting-overlay'} onClick={this.props.close} />
                <div className="setting-base" onClick={() => {}}>
                    {/* <button type="button" className="btn btn-icon setting-header-btn" onClick={this.props.close}> */}
                    {/* <FontAwesomeIcon icon={faChevronLeft} /> */}
                    {/* </button> */}
                    <div className="setting-header">コンテンツ検索</div>
                    <div className="setting-content">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" ref="searchText" placeholder="チャンネル名, 動画名, etc..." aria-label="Video ID" />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button" onClick={e => this.search(e)}>
                                    検索
                                </button>
                            </div>
                        </div>
                        <ul className="list-unstyled">
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
                    <div className="setting-footer">
                        <button type="button" className="btn btn-secondary ml-1" style={{ width: '80px' }} onClick={this.props.close}>
                            {'Close'}
                        </button>
                        <button type="button" className="btn btn-primary ml-1" style={{ width: '80px' }} onClick={this.add}>
                            {'Add'}
                        </button>
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
        this.setState({ select: [] });
        this.props.close();
    };
}
