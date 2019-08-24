import { Reducer, Action } from 'redux';
import { ParsedQuery } from 'query-string';
import _ from 'lodash';
import { StoreState, storeStateInit } from '../types';
import * as ACTION from '../constants';
import { BindAction } from '../action';
import Point from '../../utils/Point';
import Session, { SessionKey } from '../../utils/Session';
import { NowplayItem } from '../../dom.extension';

/**
 *
 * @param prevState
 * @param q
 */
const initNowPlay = (prevState: StoreState, q: ParsedQuery<string>) => {
    const init: NowplayItem[] = [{ videoId: 'uXYXC0jaN74' }, { videoId: 'Y8XpPA4jCts' }, { videoId: 'vi3AR3T70lE' }, { videoId: '8GbAsgrEpS0' }];
    const getNowplay = (): NowplayItem[] => {
        const query = ((): NowplayItem[] => {
            if (q.v instanceof Array) {
                return q.v.map(v => {
                    return { videoId: v };
                });
            }
            if (typeof q.v == 'string') return [{ videoId: q.v }];
            return [];
        })();
        const item = Session.load(SessionKey.NowPlayItem);
        let session: NowplayItem[] = item ? (JSON.parse(item) as NowplayItem[]) : [];
        session = session.filter(i => query.map(q => (q ? q.videoId : '----')).indexOf(i ? i.videoId : '---') == -1);
        return _.union(query, session);
    };
    const nowplay = getNowplay().length > 0 ? getNowplay() : init;
    return { ...prevState, nowplay: nowplay };
};

/**
 *
 * @param prevState
 * @param point
 */
const setScreenSize = (prevState: StoreState, point: Point): StoreState => {
    return { ...prevState, screenSize: point };
};

/**
 *
 * @param prevState
 * @param layout
 */
const setLayout = (prevState: StoreState, layout: { x: number[]; y: number[] }): StoreState => {
    Session.save(SessionKey.GridLayout, JSON.stringify({ x: layout.x, y: layout.y }));
    return { ...prevState, layout: { x: layout.x, y: layout.y } };
};

/**
 *
 * @param prevState
 * @param videoId
 */
const addItemFromText = (prevState: StoreState, videoId: string): StoreState => {
    if (videoId == '') {
        return prevState;
    }

    const pattern = ['http[s]://www.youtube.com/watch\\?v=(.*?)(&|$)', 'http[s]://youtu.be/(.*?)(&|$)', '(.*?)(&|$)'];
    pattern.forEach(p => {
        const result = new RegExp(p).exec(videoId);
        if (result != null) videoId = result[1];
    });

    return { ...prevState, nowplay: prevState.nowplay.concat([{ videoId: videoId, title: '' }]) };
};

/**
 *
 * @param prevState
 * @param item
 */
const addItemFromSearch = (prevState: StoreState, itemList: YoutubeItem[]): StoreState => {
    let newState = _.merge({}, prevState);
    const newNowplay = Array.from(prevState.nowplay);
    newNowplay.forEach((v, i) => {
        if (v == null) {
            const it = itemList.shift();
            newNowplay[i] = { videoId: it ? it.id.videoId : undefined };
            newState.nowplay = newNowplay;
        }
    });

    const h = Session.load(SessionKey.HistoryItem);
    let historyItem = h ? (JSON.parse(h) as YoutubeItem[]) : [];
    historyItem = historyItem.concat(itemList);
    Session.save(SessionKey.HistoryItem, JSON.stringify(historyItem));

    const count = newState.layout.x.length * newState.layout.y.length;
    const len = newState.nowplay.length;
    for (let index = 0; index < count; index++) {
        if (len <= index) newState = nextContents(newState, index);
    }
    return newState;
};

/**
 *
 * @param prevState
 * @param param
 */
const setTitle = (prevState: StoreState, param: { index: number; title: string }): StoreState => {
    const newNowplay = Array.from(prevState.nowplay);
    (newNowplay[param.index] || {}).title = param.title;
    return { ...prevState, nowplay: newNowplay };
};

/**
 *
 * @param prevState
 * @param point
 */
const nextContents = (prevState: StoreState, index: number): StoreState => {
    const newNowplay: (NowplayItem | null)[] = Array.from(prevState.nowplay);
    const count = prevState.layout.x.length * prevState.layout.y.length;
    const len = prevState.nowplay.length;
    if (count < len) {
        newNowplay[index] = prevState.nowplay[count];
        newNowplay.splice(count, 1);
        return { ...prevState, nowplay: newNowplay };
    }

    const h = Session.load(SessionKey.HistoryItem);
    let stock = h ? (JSON.parse(h) as YoutubeItem[]) : [];
    if (stock.length > 0) {
        newNowplay[index] = { videoId: stock[0].id.videoId };
        Session.save(SessionKey.HistoryItem, JSON.stringify(stock.slice(1)));
    } else {
        newNowplay[index] = null;
    }
    return { ...prevState, nowplay: newNowplay };
};

/**
 *
 * @param prevState
 */
const openSetting = (prevState: StoreState): StoreState => {
    return { ...prevState, setting: true };
};

/**
 *
 * @param prevState
 */
const closeSetting = (prevState: StoreState): StoreState => {
    return { ...prevState, setting: false };
};

/**
 *
 * @param prevState
 */
const allStart = (prevState: StoreState): StoreState => {
    return { ...prevState, bulkPlay: true };
};

/**
 *
 * @param prevState
 */
const allStop = (prevState: StoreState): StoreState => {
    return { ...prevState, bulkPlay: false };
};

/**
 *
 * @param prevState
 */
const allVolumeDown = (prevState: StoreState): StoreState => {
    return { ...prevState, bulkVolume: Math.max(prevState.bulkVolume - 10, 0) };
};

/**
 *
 * @param prevState
 */
const allVolumeUp = (prevState: StoreState): StoreState => {
    return { ...prevState, bulkVolume: Math.min(prevState.bulkVolume + 10, 100) };
};

// ===============================================================================================
/**
 * Action Mapping
 */
const actionMapping: { [key: string]: (prevState: StoreState, action: any) => StoreState } = {
    [ACTION.INIT_NOW_PLAY]: initNowPlay,
    [ACTION.SET_SCREEN_SIZE]: setScreenSize,
    [ACTION.SET_LAYOUT]: setLayout,
    [ACTION.ADD_ITEM_FROM_TEXT]: addItemFromText,
    [ACTION.ADD_ITEM_FROM_SEARCH]: addItemFromSearch,
    [ACTION.SET_TITLE]: setTitle,
    [ACTION.NEXT_CONTENTS]: nextContents,
    [ACTION.OPEN_SETTING]: openSetting,
    [ACTION.CLOSE_SETTING]: closeSetting,
    [ACTION.ALL_START]: allStart,
    [ACTION.ALL_STOP]: allStop,
    [ACTION.ALL_VOLUME_DOWN]: allVolumeDown,
    [ACTION.ALL_VOLUME_UP]: allVolumeUp,
};

/**
 * 触るな危険！
 * @param prevState
 * @param action
 */
export const bindReducer: Reducer<StoreState, BindAction> = (prevState: StoreState | undefined = storeStateInit, action: BindAction): StoreState => {
    console.log('prevState', prevState, action);
    const newState = (() => {
        const func: ((prevState: StoreState, payload: any) => StoreState) | undefined = actionMapping[action.type];
        return func ? func(prevState, action.payload) : prevState;
    })();
    console.log('newState', newState, action);
    return newState;
};
