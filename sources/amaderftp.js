const { axios, extractQuality, extractYear, titlesMatch } = require('./utils');

const BASE = 'http://amaderftp.net';

async function getMoviePage(tmdbId) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await axios.get(BASE + '/movies.php', {
                params: { id: tmdbId, type: 'movie' },
                timeout: 8000,
                maxContentLength: 2000000
            });
            return response.data;
        } catch { }
    }
    return null;
}

function mediaUrls(html) {
    return [...new Set(
        (html.match(/https?:\/\/[^"'<>\s]+?\.(?:mkv|mp4|m3u8)(?:\?[^"'<>\s]*)?/gi) || [])
            .map(url => url.replace(/&amp;/g, '&'))
    )];
}

async function isPlayable(url) {
    try {
        const response = await axios.head(url, {
            timeout: 6000,
            maxRedirects: 3,
            validateStatus: () => true
        });
        const type = response.headers['content-type'] || '';
        return (response.status === 200 || response.status === 206) &&
            (/^video\//i.test(type) || /octet-stream/i.test(type));
    } catch {
        return false;
    }
}

module.exports = {
    name: 'AmaderFTP',
    types: ['movie'],
    async getStreams(type, meta) {
        const tmdbId = String(meta?.moviedb_id || '');
        if (type !== 'movie' || !/^\d+$/.test(tmdbId)) return [];
        try {
            const page = await getMoviePage(tmdbId);
            if (!page) return [];
            const pageTitle = page.match(/<title[^>]*>([^<]*)/i)?.[1] || '';
            if (!titlesMatch(pageTitle, meta.name)) return [];
            const year = extractYear(pageTitle);
            if (meta.year && year && Math.abs(year - Number.parseInt(meta.year, 10)) > 1) return [];
            const urls = mediaUrls(page).slice(0, 6);
            const checked = await Promise.all(urls.map(async url => {
                if (!await isPlayable(url)) return null;
                let filename = url.split('/').pop() || '';
                try { filename = decodeURIComponent(filename); } catch { }
                return { name: 'AmaderFTP', title: extractQuality(filename), url };
            }));
            return checked.filter(Boolean);
        } catch {
            return [];
        }
    }
};
