// StreamBDIX - By Corpse
const { extractQuality, titlesMatch, axios } = require('./utils');

const SOURCE_NAME = 'CityPlex';
const BASE_URL = 'https://cityplex.live';
const API_URL = `${BASE_URL}/api`;
const axiosConfig = {
    timeout: 5000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
};
async function search(query) {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            ...axiosConfig,
            params: { search: query }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch { return []; }
}

function findBestMatch(results, type, meta) {
    const expectedType = type === 'movie' ? 'movie' : 'tv';
    const candidates = results.filter(result => result.type === expectedType);
    const imdbId = meta.id || meta.imdb_id;

    if (imdbId) {
        const exact = candidates.find(result => result.imdb_id === imdbId);
        if (exact) return exact;
    }

    return candidates
        .filter(result => titlesMatch(result.title || result.original_title, meta.name))
        .sort((a, b) => {
            if (!meta.year) return 0;
            return Math.abs((a.year || meta.year) - meta.year) - Math.abs((b.year || meta.year) - meta.year);
        })[0] || null;
}

function streamUrl(type, id) {
    const cityplexType = type === 'movie' ? 'movies' : 'tv_shows';
    return `${API_URL}/stream/video/stream?type=${cityplexType}&id=${id}`;
}

async function getStreamTitle(url) {
    try {
        const response = await axios.head(url, {
            ...axiosConfig,
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400
        });
        const location = response.headers.location || '';
        let filename = location.split('/').pop() || location;
        try { filename = decodeURIComponent(filename); } catch { }
        return extractQuality(filename);
    } catch { return 'Unknown'; }
}

async function makeStream(type, id) {
    const url = streamUrl(type, id);
    return {
        name: SOURCE_NAME,
        title: await getStreamTitle(url),
        url
    };
}

async function getSeriesStream(showId, season, episode) {
    try {
        const response = await axios.get(`${API_URL}/tv-shows/${showId}/${season}`, axiosConfig);
        const episodes = Array.isArray(response.data) ? response.data : [];
        const match = episodes.find(item =>
            Number(item.season_number) === Number(season) &&
            Number(item.episode_number) === Number(episode)
        );
        return match ? [await makeStream('series', match.id)] : [];
    } catch { return []; }
}

module.exports = {
    name: SOURCE_NAME,
    types: ['movie', 'series'],
    async getStreams(type, meta, season, episode) {
        if (!meta || !meta.name) return [];
        const results = await search(meta.name);
        const match = findBestMatch(results, type, meta);
        if (!match) return [];

        if (type === 'movie') return [await makeStream(type, match.id)];
        return await getSeriesStream(match.id, season, episode);
    }
};
