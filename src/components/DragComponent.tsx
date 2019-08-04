import React from 'react';
import YouTube from 'react-youtube';
import { typeAlias } from '@babel/types';
import { CustomMouseEvent } from '../dom.extension';

interface DragComponentProps {
    moveXY: { ix: number | null; iy: number | null };
    indexX: number;
    indexY: number;
    key: string;
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
                    backgroundColor: this.props.color,
                }}
                key={this.props.key}
                onMouseDown={e => this.props.onEventChange(e, this.props.indexX, this.props.indexY)}
                onMouseMove={e => this.props.onMove(e)}
            />
        );
    }
}
