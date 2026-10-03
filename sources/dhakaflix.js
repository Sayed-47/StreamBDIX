// StreamBDIX - By Corpse
const { extractQuality, titlesMatch, axios } = require('./utils');
const SOURCE_NAME = 'DHAKAFLIX';
const SERVERS = {
    movies: [
        { url: 'http://172.16.50.14', name: 'DHAKA-FLIX-14' },
        { url: 'http://172.16.50.7', name: 'DHAKA-FLIX-7' }
    ],
    series: [{ url: 'http://172.16.50.12', name: 'DHAKA-FLIX-12' }]
};
function getNameFromPath(href) {
    const decoded = decodeURIComponent(href);
    const parts = decoded.split('/').filter(p => p);
    return parts[parts.length - 1] || '';
}
function extractTitleAndYear(filename) {
    let match = filename.match(/^(.+?)\s*\((\d{4})\)/);
    if (match) return { title: match[1].trim(), year: parseInt(match[2]) };
    match = filename.match(/\b(19\d{2}|20\d{2})\b/);
    if (match) {
        const year = parseInt(match[1]);
        const titleMatch = filename.match(/^(.+?)(?:\s*[\(\[\-\|]|\s+\d{4}|$)/);
        return { title: titleMatch ? titleMatch[1].trim() : filename, year };
    }
    return { title: filename, year: null };
}
function extractSeasonEpisode(filename) {
    const match = filename.match(/S(\d+)\D*E(\d+)/i);
    if (match) return { season: parseInt(match[1]), episode: parseInt(match[2]) };
    return null;
}
async function searchServer(query, server) {
    try {
        const searchUrl = `${server.url}/${server.name}/`;
        const body = JSON.stringify({
            action: 'get',
            search: { href: `/${server.name}/`, pattern: query, ignorecase: true }
        });
        const response = await axios.post(searchUrl, body, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
        });
        if (!response.data?.search) return [];
        return response.data.search
            .filter(item => {
                const href = item.href.toLowerCase();
                return !item.size || href.endsWith('.mkv') || href.endsWith('.mp4');
            })
            .map(item => ({
                href: item.href,
                name: getNameFromPath(item.href),
                isFile: item.size !== null,
                fullUrl: server.url + item.href
            }));
    } catch { return null; }
}
function findMovieStreams(results, metaName, metaYear, serverName) {
    const streams = [];
    const seen = new Set();
    for (const result of results) {
        if (!result.isFile) continue;
        const { title: fileTitle, year: fileYear } = extractTitleAndYear(result.name);
        if (!titlesMatch(fileTitle, metaName)) continue;
        if (metaYear && fileYear && Math.abs(metaYear - fileYear) > 1) continue;
        if (seen.has(result.fullUrl)) continue;
        seen.add(result.fullUrl);
        streams.push({ name: serverName, title: extractQuality(result.name), url: result.fullUrl });
    }
    return streams;
}
function findSeriesStreams(results, metaName, targetSeason, targetEpisode, serverName) {
    const streams = [];
    const seen = new Set();
    for (const result of results) {
        if (!result.isFile) continue;
        const { title: fileTitle } = extractTitleAndYear(result.name);
        if (!titlesMatch(fileTitle, metaName)) continue;
        const seInfo = extractSeasonEpisode(result.name);
        if (!seInfo) continue;
        if (seInfo.season !== targetSeason || seInfo.episode !== targetEpisode) continue;
        if (seen.has(result.fullUrl)) continue;
        seen.add(result.fullUrl);
        streams.push({ name: serverName, title: extractQuality(result.name), url: result.fullUrl });
    }
    return streams;
}
function getSearchTerms(title) {
    const cleaned = title.replace(/[:\-–—]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleaned.split(' ').filter(w => w.length > 2);
    const terms = [];
    if (words.length > 0) terms.push(words[0]);
    if (words.length > 1) terms.push(words.slice(0, 2).join(' '));
    terms.push(cleaned);
    return [...new Set(terms)];
}
module.exports = {
    name: SOURCE_NAME,
    types: ['movie', 'series'],
    async getStreams(type, meta, season, episode) {
        const servers = type === 'movie' ? SERVERS.movies : SERVERS.series;
        const searchTerms = getSearchTerms(meta.name);
        const allStreams = await Promise.all(servers.map(async server => {
            for (const term of searchTerms) {
                const results = await searchServer(term, server);
                if (results === null) break;
                const streams = type === 'movie'
                    ? findMovieStreams(results, meta.name, meta.year, server.name)
                    : findSeriesStreams(results, meta.name, season, episode, server.name);
                if (streams.length > 0) return streams;
            }
            return [];
        }));
        return allStreams.flat();
    }
};
