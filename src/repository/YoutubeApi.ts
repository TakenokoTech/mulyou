import setting from '../../setting.json';
import { gapi } from '../utils/gapi';

/**
 * 動画検索
 * @param text
 * @param pageToken
 */
export const fetchVideo = async (text: string, pageToken: string | null = null): Promise<any> => {
    return new Promise(resolve => {
        gapi.load('client', () => {
            gapi.client.load('youtube', 'v3', () => {
                gapi.client.setApiKey(setting.ApiKey);
                const request = (gapi.client as any).youtube.search.list({
                    q: text,
                    type: 'video',
                    part: 'snippet',
                    maxResults: '20',
                    order: 'date',
                    pageToken: pageToken,
                });
                request.execute((response: any) => {
                    resolve(response.result);
                });
            });
        });
    });
};

/**
 * チャンネル検索
 * @param text
 * @param pageToken
 */
export const fetchChannel = async (text: string, pageToken: string | null = null): Promise<any> => {
    return new Promise(resolve => {
        gapi.load('client', () => {
            gapi.client.load('youtube', 'v3', () => {
                gapi.client.setApiKey(setting.ApiKey);
                console.log((gapi.client as any).youtube);
                const request = (gapi.client as any).youtube.search.list({
                    q: text,
                    type: 'channel',
                    part: 'snippet',
                    maxResults: '20',
                    order: 'viewCount',
                    pageToken: pageToken,
                });
                request.execute((response: any) => {
                    resolve(response.result);
                });
            });
        });
    });
};

export const channelList = async (id: string, pageToken: string | null = null): Promise<any> => {
    return new Promise(resolve => {
        gapi.load('client', () => {
            gapi.client.load('youtube', 'v3', () => {
                gapi.client.setApiKey(setting.ApiKey);
                const request = (gapi.client as any).youtube.channels.list({
                    id: id,
                    part: 'snippet',
                    maxResults: '20',
                    pageToken: pageToken,
                });
                request.execute((response: any) => {
                    resolve(response.result);
                });
            });
        });
    });
};
