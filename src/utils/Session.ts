export enum SessionKey {
    HistoryWord = 'historyWord',
    GridLayout = 'GridLayout',
    HistoryItem = 'HistoryItem',
    NowPlayItem = 'NowPlayItem',
}

class Session {
    save(key: SessionKey, value: string) {
        window.sessionStorage.setItem(key, value);
    }

    load(key: SessionKey): string | null {
        return window.sessionStorage.getItem(key);
    }

    clear() {
        window.sessionStorage.clear();
    }
}

export default new Session();