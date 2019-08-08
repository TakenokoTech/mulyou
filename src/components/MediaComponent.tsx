import React from 'react';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import Point from '../utils/Point';

interface MadiaComponentProps {
    screenSize: Point;
    videoId: string;
    height: number;
    width: number;
    left: number;
    top: number;
    setting: boolean;
    onEnd: () => void;
}

interface MadiaComponentState {
    selecting: boolean;
}

export default class MadiaComponent extends React.Component<MadiaComponentProps, MadiaComponentState> {
    constructor(props: MadiaComponentProps) {
        super(props);
        this.state = { selecting: false };
    }

    componentDidMount() {
        if (this.props.videoId == 'unknown') this.props.onEnd();
    }

    render() {
        return this.props.videoId ? (
            <div
                className={`frame_box`}
                style={{
                    left: this.props.left,
                    top: this.props.top,
                    border: this.state.selecting ? '4px solid #F00' : '4px solid #F000',
                }}
                key={this.props.videoId}
            >
                <YouTube
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
                {this.props.setting ? (
                    <>
                        <button className="close_button btn btn-danger rounded-circle p-0" style={{ zIndex: 1000 }} onClick={() => this.props.onEnd()}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button className="select_button btn btn-success rounded-circle p-0" style={{ zIndex: 1000 }} onClick={this.onCheck}>
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    </>
                ) : null}
            </div>
        ) : null;
    }

    private onReady = (event: { target: any }) => {
        console.log('onReady');
        // event.target.pauseVideo();
        event.target.mute();
    };

    private onPlay = (event: { target: any; data: number }) => {
        console.log('onPlay', event.target, event.data);
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
