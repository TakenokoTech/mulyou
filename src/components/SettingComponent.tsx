import React from 'react';
import Point from '../utils/Point';
import ModalComponent from './SearchModalComponent';
import GridModalComponent from './GridModalComponent';
import StockModalComponent from './StockModalComponent';

interface SettingComponentProps {
    screenSize: Point;
    layout: { x: number[]; y: number[] };
    addInputItem: (value: string) => void;
    addSearchItem: (item: YoutubeItem[]) => void;
    setLayout: (lx: number[], ly: number[]) => void;
    closeSetting: () => void;
}

interface SettingComponentState {}

export default class SettingComponent extends React.Component<SettingComponentProps, SettingComponentState> {
    constructor(props: SettingComponentProps) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <div id="settingPanel" style={{}}>
                <div className="input-group">
                    <input type="text" className="form-control" ref="inputVideo" placeholder="Video ID" aria-label="Video ID" />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={e => this.props.addInputItem((this.refs.inputVideo as HTMLInputElement).value)}
                        >
                            ADD
                        </button>{' '}
                        <ModalComponent screenSize={this.props.screenSize} addItem={this.props.addSearchItem} />
                    </div>
                </div>
                <div style={{ fontSize: '18px', textAlign: 'right', padding: '8px 0px' }}>
                    <button type="button" className="btn btn-primary ml-1" onClick={() => {}}>
                        全再生{' '}
                    </button>
                    <button type="button" className="btn btn-primary ml-1 mr-3" onClick={() => {}}>
                        全停止{' '}
                    </button>
                    <StockModalComponent screenSize={this.props.screenSize} />
                    <GridModalComponent screenSize={this.props.screenSize} layout={this.props.layout} setLayout={this.props.setLayout} />
                </div>
                <button id="settingPanelClose" className="btn btn-light" onClick={this.props.closeSetting}>
                    close
                </button>
            </div>
        );
    }
}
