import React from 'react';
import { CustomMouseEvent } from '../dom.extension';
import { faCog, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DragComponent.css';

interface DragComponentProps {
    moveXY: { ix: number | null; iy: number | null };
    indexX: number;
    indexY: number;
    dragKey: string;
    left: number;
    top: number;
    color: string;
    onEventChange: (e: CustomMouseEvent, ix: number | null, iy: number | null) => void;
    onMove: (e: CustomMouseEvent) => void;
}

interface DragComponentState {}

export default class DragComponent extends React.Component<DragComponentProps, DragComponentState> {
    render() {
        return (
            <div
                className="drag_button"
                style={{
                    left: this.props.left,
                    top: this.props.top,
                    backgroundColor: 'transparent',
                }}
                key={this.props.dragKey}
                onMouseDown={e => this.props.onEventChange(e, this.props.indexX, this.props.indexY)}
                onMouseMove={e => this.props.onMove(e)}
            >
                <button
                    className="btn btn-secondaly rounded-circle p-0"
                    style={{ position: 'absolute', width: '24px', height: '24px', right: '0px', top: '0px' }}
                >
                    <FontAwesomeIcon icon={faArrowsAlt} style={{ color: this.props.color }} />
                </button>
            </div>
        );
    }
}
