import _ from 'lodash';
import Point from '../../utils/Point';
import { NowplayItem } from '../../dom.extension';
import Session, { SessionKey } from '../../utils/Session';

export interface StoreState {
    screenSize: Point;
    nowplay: (NowplayItem | null)[];
    setting: boolean;
    layout: { x: number[]; y: number[] };
    bulkPlay: boolean;
    bulkVolume: number;
}

const initLayout = (): { x: []; y: [] } => {
    const gridLayout = Session.load(SessionKey.GridLayout);
    const l = gridLayout ? JSON.parse(gridLayout) : { x: [1, 1], y: [1, 1] };
    return { x: l.x || [], y: l.y || [] };
};

export const storeStateInit = {
    screenSize: new Point(0, 0),
    nowplay: [],
    layout: initLayout(),
    setting: false,
    bulkPlay: true,
    bulkVolume: 0,
};
