import React from 'react';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faArrowAltCircleDown, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import Point from '../utils/Point';
import './MediaComponent.css';

interface MadiaComponentProps {
    screenSize: Point;
    videoId: string | null;
    height: number;
    width: number;
    left: number;
    top: number;
    setting: boolean;
    bulkVolume: number;
    bulkPlay: boolean;
    onReady: (title: string) => void;
    onEnd: () => void;
}

interface MadiaComponentState {
    player: any;
    selecting: boolean;
}

export default class MadiaComponent extends React.Component<MadiaComponentProps, MadiaComponentState> {
    constructor(props: MadiaComponentProps) {
        super(props);
        this.state = { player: null, selecting: false };
    }

    componentDidMount() {
        if (this.props.videoId == null) this.props.onEnd();
    }

    shouldComponentUpdate(nextProps: MadiaComponentProps, nextState: MadiaComponentState, nextContext: any) {
        if (!this.state.player || !this.state.player.a) return true;
        // console.log(this.props.bulkVolume, nextProps.bulkVolume);
        if (this.props.bulkVolume != nextProps.bulkVolume && nextProps.bulkVolume == 0) {
            this.state.player.mute();
        }
        if (this.props.bulkVolume != nextProps.bulkVolume && nextProps.bulkVolume > 0) {
            this.state.player.unMute();
            this.state.player.setVolume(nextProps.bulkVolume);
        }
        if (this.props.bulkPlay && !nextProps.bulkPlay) {
            this.state.player.pauseVideo();
        }
        if (!this.props.bulkPlay && nextProps.bulkPlay) {
            this.state.player.playVideo();
        }
        return true;
    }

    render() {
        console.log('videoId', this.props.videoId);
        return (
            <div
                className={`frame_box`}
                style={{
                    left: this.props.left,
                    top: this.props.top,
                    border: this.props.setting && this.state.selecting ? '4px solid #F00' : '4px solid #F000',
                }}
                key={this.props.videoId || ''}
            >
                {this.props.videoId ? (
                    <YouTube
                        ref="m"
                        videoId={this.props.videoId}
                        opts={{
                            width: `${this.props.width}`,
                            height: `${this.props.height}`,
                            playerVars: {
                                autoplay: 1,
                            },
                        }}
                        onReady={this.onReady}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onEnd={this.onEnd}
                        onError={this.onError}
                        onStateChange={this.onStateChange}
                    />
                ) : (
                    <div
                        style={{
                            width: `${this.props.width}`,
                            height: `${this.props.height}`,
                        }}
                    >
                        <button className="next_button" style={{}} onClick={() => this.props.onEnd()}>
                            <FontAwesomeIcon icon={faArrowAltCircleRight} size="3x" />
                        </button>
                    </div>
                )}
                {this.props.setting ? (
                    <>
                        {/* <button className="close_button btn btn-danger rounded-circle p-0" style={{ zIndex: 550 }} onClick={() => this.props.onEnd()}> */}
                        {/* <FontAwesomeIcon icon={faTimes} /> */}
                        {/* </button> */}
                        {/* <button className="select_button btn btn-success rounded-circle p-0" style={{ zIndex: 550 }} onClick={this.onCheck}> */}
                        {/* <FontAwesomeIcon icon={faCheck} /> */}
                        {/* </button> */}
                        <button className="close_triangle_button" style={{ zIndex: 550 }} onClick={() => this.props.onEnd()}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </>
                ) : null}
            </div>
        );
    }

    private onReady = (event: { target: any }) => {
        console.log('onReady');
        if (!this.props.bulkPlay) {
            event.target.pauseVideo();
        }
        event.target.mute();
        this.props.onReady(event.target.getVideoData().title);
        this.setState({ player: event.target });
    };

    private onPlay = (event: { target: any; data: number }) => {
        console.log('onPlay');
    };

    private onPause = (event: { target: any; data: number }) => {
        console.log('onPause', event.target, event.data);
    };

    private onEnd = (event: { target: any; data: number }) => {
        console.log('onEnd', event.target, event.data);
        this.props.onEnd();
    };

    private onError = (event: { target: any; data: number }) => {
        console.log('onError', event.target, event.data);
    };

    private onStateChange = (event: { target: any; data: number }) => {
        // console.log('onStateChange', event.target, event.data);
    };

    private onCheck = (event: { target: any }) => {
        console.log('onCheck');
        this.setState({ selecting: !this.state.selecting });
    };
}
