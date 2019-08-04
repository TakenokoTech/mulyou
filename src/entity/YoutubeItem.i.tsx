interface YoutubeItem {
    kind: string; // "youtube#searchResult",
    etag: string; // "\"Bdx4f4ps3xCOOo1WZ91nTLkRZ_c/HcD0uQSFk1hNXrjjrKbGqgZ2_No\"",
    id: {
        kind: string; //"youtube#channel",
        channelId: string; //"UC4YaOt1yT-ZeyB0OmxHgolA"
        videoId: string;
    };
    snippet: {
        publishedAt: string; // "2016-10-19T06:03:24.000Z",
        channelId: string; // "UC4YaOt1yT-ZeyB0OmxHgolA",
        title: string; //"A.I.Channel",
        description: string; //"はじめまして！ キズナアイです(o・v・o)♪ チャンネル登録よろしくお願いしますლ(´ڡ`ლ) --- 2019/05/15リリース決定！ \"Kizuna AI 1st アルバム「hello,...",
        thumbnails: {
            default: {
                url: string; // "https://yt3.ggpht.com/-phqR1pvakkM/AAAAAAAAAAI/AAAAAAAAAAA/ajOkOO-ItrU/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"
            };
            medium: {
                url: string; //"https://yt3.ggpht.com/-phqR1pvakkM/AAAAAAAAAAI/AAAAAAAAAAA/ajOkOO-ItrU/s240-c-k-no-mo-rj-c0xffffff/photo.jpg"
            };
            high: {
                url: string; //"https://yt3.ggpht.com/-phqR1pvakkM/AAAAAAAAAAI/AAAAAAAAAAA/ajOkOO-ItrU/s800-c-k-no-mo-rj-c0xffffff/photo.jpg"
            };
        };
        channelTitle: string; //"A.I.Channel",
        liveBroadcastContent: string; //"upcoming"
    };
}
