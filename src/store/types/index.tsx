import Point from '../../utils/Point';
import { NowplayItem } from '../../dom.extension';
import Session, { SessionKey } from '../../utils/Session';
import _ from 'lodash';

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

const initNowplay = (): (NowplayItem | null)[] => {
    const init: NowplayItem[] = [{ videoId: 'uXYXC0jaN74' }, { videoId: 'Y8XpPA4jCts' }, { videoId: 'vi3AR3T70lE' }, { videoId: '8GbAsgrEpS0' }];
    const q = { v: [] };
    const getNowplay = (): NowplayItem[] => {
        const query = ((): NowplayItem[] => {
            if (q.v instanceof Array) {
                return q.v.map(v => {
                    return { videoId: v };
                });
            }
            if (typeof q.v == 'string') {
                return [{ videoId: q.v }];
            }
            return [];
        })();
        const item = Session.load(SessionKey.NowPlayItem);
        let session: NowplayItem[] = item ? (JSON.parse(item) as NowplayItem[]) : [];
        session = session.filter(i => query.map(q => (q ? q.videoId : '----')).indexOf(i ? i.videoId : '---') == -1);
        return _.union(query, session);
    };
    return getNowplay().length > 0 ? getNowplay() : init;
};

export const storeStateInit = {
    screenSize: new Point(0, 0),
    nowplay: initNowplay(),
    layout: initLayout(),
    setting: false,
    bulkPlay: false,
    bulkVolume: 0,
};
