import React from 'react';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Point from '../utils/Point';

interface MadiaComponentProps {
    screenSize: Point;
    key: string;
    videoId: string;
    height: number;
    width: number;
    left: number;
    top: number;
    setting: boolean;
    onClose: () => void;
}

interface MadiaComponentState {}

export default class MadiaComponent extends React.Component<MadiaComponentProps, MadiaComponentState> {
    constructor(props: MadiaComponentProps) {
        super(props);
    }

    render() {
        return this.props.videoId ? (
            <div
                className={`frame_box`}
                style={{
                    left: this.props.left,
                    top: this.props.top,
                }}
                key={this.props.key}
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
                />
                {this.props.setting ? (
                    <button
                        className="close_button btn btn-danger rounded-circle p-0"
                        style={
                            {
                                /* */
                            }
                        }
                        onClick={() => this.props.onClose()}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                ) : null}
            </div>
        ) : null;
    }

    private onReady(event: { target: any }) {
        console.log('onReady');
        // event.target.pauseVideo();
        event.target.mute();
    }
}
