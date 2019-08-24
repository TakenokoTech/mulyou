export enum SessionKey {
    HistoryWord = 'historyWord',
    GridLayout = 'GridLayout',
    HistoryItem = 'HistoryItem',
    NowPlayItem = 'NowPlayItem',
    EnableResize = 'EnableResize',
}

class Session {
    save(key: SessionKey, value: string) {
        console.log('save', key, value);
        window.sessionStorage.setItem(key, value);
    }

    load(key: SessionKey): string | null {
        console.log('load', key);
        return window.sessionStorage.getItem(key);
    }

    clear() {
        window.sessionStorage.clear();
    }
}

export default new Session();
