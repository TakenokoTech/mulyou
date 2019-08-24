import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import queryString, { ParsedQuery } from 'query-string';
import { StoreState } from '../store/types';

import * as actions from '../store/action';
import { AppContainer } from './AppContainer';
import Point from '../utils/Point';

export interface MapDispatchProps {
    initNowPlay: (query: ParsedQuery<string>) => void;
    setScreenSize: (point: Point) => void;
    setLayout: (x: number[], y: number[]) => void;
    addItemFromText: (videoId: string) => void;
    addItemFromSearch: (itemList: YoutubeItem[]) => void;
    setTitle: (index: number, title: string) => void;
    nextContents: (index: number) => void;
    openSetting: () => void;
    closeSetting: () => void;
    allStart: () => void;
    allStop: () => void;
    allVolumeDown: () => void;
    allVolumeUp: () => void;
}

const mapStateToProps = (state: StoreState) => {
    return state;
};

const mapDispatchToProps = (dispatch: Dispatch<actions.BindAction>): MapDispatchProps => {
    return {
        initNowPlay: (query: ParsedQuery<string>) => dispatch(actions.initNowPlay(query)),
        setScreenSize: (point: Point) => dispatch(actions.setScreenSize(point)),
        setLayout: (x: number[], y: number[]) => dispatch(actions.setLayout(x, y)),
        addItemFromText: (videoId: string) => dispatch(actions.addItemFromText(videoId)),
        addItemFromSearch: (itemList: YoutubeItem[]) => dispatch(actions.addItemFromSearch(itemList)),
        setTitle: (index: number, title: string) => dispatch(actions.setTitle(index, title)),
        nextContents: (index: number) => dispatch(actions.nextContents(index)),
        openSetting: () => dispatch(actions.openSetting()),
        closeSetting: () => dispatch(actions.closeSetting()),
        allStart: () => dispatch(actions.allStart()),
        allStop: () => dispatch(actions.allStop()),
        allVolumeDown: () => dispatch(actions.allVolumeDown()),
        allVolumeUp: () => dispatch(actions.allVolumeUp()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppContainer);
