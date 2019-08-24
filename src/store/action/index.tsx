import * as ACTION from '../constants';
import Point from '../../utils/Point';
import { ParsedQuery } from 'query-string';

/**
 *
 */
interface InitNowPlay {
    type: ACTION.INIT_NOW_PLAY;
    payload: ParsedQuery<string>;
}
export const initNowPlay = (query: ParsedQuery<string>): InitNowPlay => {
    return { type: ACTION.INIT_NOW_PLAY, payload: query };
};

/**
 *
 */
interface SetScreenSize {
    type: ACTION.SET_SCREEN_SIZE;
    payload: Point;
}
export const setScreenSize = (point: Point): SetScreenSize => {
    return { type: ACTION.SET_SCREEN_SIZE, payload: point };
};

/**
 *
 */
interface SetLayout {
    type: ACTION.SET_LAYOUT;
    payload: { x: number[]; y: number[] };
}
export const setLayout = (x: number[], y: number[]): SetLayout => {
    return { type: ACTION.SET_LAYOUT, payload: { x: x, y: y } };
};

/**
 *
 */
interface AddItemFromText {
    type: ACTION.ADD_ITEM_FROM_TEXT;
    payload: string;
}
export const addItemFromText = (videoId: string): AddItemFromText => {
    return { type: ACTION.ADD_ITEM_FROM_TEXT, payload: videoId };
};

/**
 *
 */
interface AddItemFromSearch {
    type: ACTION.ADD_ITEM_FROM_SEARCH;
    payload: YoutubeItem[];
}
export const addItemFromSearch = (itemList: YoutubeItem[]): AddItemFromSearch => {
    return { type: ACTION.ADD_ITEM_FROM_SEARCH, payload: itemList };
};

/**
 *
 */
interface SetTitle {
    type: ACTION.SET_TITLE;
    payload: { index: number; title: string };
}
export const setTitle = (index: number, title: string): SetTitle => {
    return { type: ACTION.SET_TITLE, payload: { index: index, title: title } };
};

/**
 *
 */
interface NextContents {
    type: ACTION.NEXT_CONTENTS;
    payload: number;
}
export const nextContents = (index: number): NextContents => {
    return { type: ACTION.NEXT_CONTENTS, payload: index };
};

/**
 *
 */
interface OpenSetting {
    type: ACTION.OPEN_SETTING;
    payload: null;
}
export const openSetting = (): OpenSetting => {
    return { type: ACTION.OPEN_SETTING, payload: null };
};

/**
 *
 */
interface CloseSetting {
    type: ACTION.CLOSE_SETTING;
    payload: null;
}
export const closeSetting = (): CloseSetting => {
    return { type: ACTION.CLOSE_SETTING, payload: null };
};

/**
 *
 */
interface AllStart {
    type: ACTION.ALL_START;
    payload: null;
}
export const allStart = (): AllStart => {
    return { type: ACTION.ALL_START, payload: null };
};

/**
 *
 */
interface AllStop {
    type: ACTION.ALL_STOP;
    payload: null;
}
export const allStop = (): AllStop => {
    return { type: ACTION.ALL_STOP, payload: null };
};

/**
 *
 */
interface AllVolumeDown {
    type: ACTION.ALL_VOLUME_DOWN;
    payload: null;
}
export const allVolumeDown = (): AllVolumeDown => {
    return { type: ACTION.ALL_VOLUME_DOWN, payload: null };
};

/**
 *
 */
interface AllVolumeUp {
    type: ACTION.ALL_VOLUME_UP;
    payload: null;
}
export const allVolumeUp = (): AllVolumeUp => {
    return { type: ACTION.ALL_VOLUME_UP, payload: null };
};

export type BindAction =
    | InitNowPlay
    | SetScreenSize
    | SetLayout
    | AddItemFromText
    | AddItemFromSearch
    | SetTitle
    | NextContents
    | OpenSetting
    | CloseSetting
    | AllStart
    | AllStop
    | AllVolumeDown
    | AllVolumeUp;
