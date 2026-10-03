// CTG Movies source. The site renders search cards and media links in its HTML.
const { axios, extractQuality, normalize } = require('./utils');

const BASE = 'https://ctgmovies.com';
const TIMEOUT = 7000;

function decodeEntities(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#(?:39|x27);/gi, "'");
}

function searchCards(html, type) {
    const route = type === 'movie' ? 'movies' : 'tv';
    const cards = [];
    const re = /<a\b[^>]*href="(\/(?:movies|tv)\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = re.exec(html)) !== null) {
        if (!match[1].startsWith('/' + route + '/')) continue;
        const title = decodeEntities(match[2].match(/<img\b[^>]*\balt="([^"]+)"/i)?.[1] || '');
        const year = Number(match[2].match(/\b(19\d{2}|20\d{2})\b/)?.[1] || 0);
        if (title) cards.push({ path: match[1], title, year });
    }
    return cards;
}

function mediaUrls(html, type, season, episode) {
    const text = html.replace(/\\"/g, '"').replace(/\\\//g, '/');
    if (type === 'movie') {
        const urls = text.match(/https?:\/\/[^"'\\<>\s]+?\.(?:mkv|mp4|m3u8)(?:\?[^"'\\<>\s]*)?/gi) || [];
        return [...new Set(urls.map(decodeEntities))];
    }
    const re = /"url":"(https?:\/\/[^"]+?\.(?:mkv|mp4|m3u8))"[^{}]{0,600}?"season_number":(\d+),"episode_number":(\d+)/gi;
    const urls = [];
    let match;
    while ((match = re.exec(text)) !== null) {
        if (Number(match[2]) === Number(season) && Number(match[3]) === Number(episode)) {
            urls.push(decodeEntities(match[1]));
        }
    }
    return [...new Set(urls)];
}

async function isPlayable(url) {
    try {
        const response = await axios.head(url, {
            timeout: TIMEOUT,
            maxRedirects: 3,
            validateStatus: () => true
        });
        return response.status === 200 || response.status === 206;
    } catch {
        return false;
    }
}

module.exports = {
    name: 'CTG Movies',
    types: ['movie', 'series'],
    async getStreams(type, meta, season, episode) {
        if (!meta?.name) return [];
        try {
            const metaYear = Number.parseInt(meta.year, 10) || 0;
            const search = await axios.get(BASE + '/search', {
                params: { q: meta.name },
                timeout: TIMEOUT
            });
            const candidates = searchCards(search.data, type).filter(card =>
                normalize(card.title) === normalize(meta.name) &&
                (!metaYear || !card.year || Math.abs(card.year - metaYear) <= 1)
            );
            const results = await Promise.all(candidates.slice(0, 3).map(async card => {
                const page = await axios.get(BASE + card.path, { timeout: TIMEOUT });
                return mediaUrls(page.data, type, season, episode);
            }));
            const urls = [...new Set(results.flat())].slice(0, 8);
            const checked = await Promise.all(urls.map(async url => {
                if (!await isPlayable(url)) return null;
                let filename = url.split('/').pop() || '';
                try { filename = decodeURIComponent(filename); } catch { }
                return { name: 'CTG Movies', title: extractQuality(filename), url };
            }));
            return checked.filter(Boolean);
        } catch {
            return [];
        }
    }
};
