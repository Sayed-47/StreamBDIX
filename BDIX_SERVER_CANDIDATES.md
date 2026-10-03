# Additional BDIX server candidates

Checked on 2026-10-03 from this Windows connection. These are public URLs collected from GitHub projects, not configured StreamBDIX sources. An HTTP response confirms only that a host answered; Stremio support also requires a working search method and direct playable media links. Timeouts may reflect ISP-specific BDIX access.

Sources: [BDIX Server Monitor list](https://github.com/fam007e/bdix-server-monitor/blob/main/data/server.json) (M), [BDIX FTP directory](https://github.com/TelepathyVijay/bdix-ftp-server/blob/main/FTP_List.md) (D), [PotFlix server configuration](https://github.com/ReduanNurLabid/PotFlix/blob/main/app/src/main/java/com/potflix/data/local/preferences/ServerConfig.kt) (P), and [Niloy Cloudstream providers](https://github.com/Niloy-Sarker/niloy-cloudstream) (N).

| Candidate | URL | Source | HTTP check | Notes |
| --- | --- | --- | --- | --- |
| SunPlex | https://sunplex.net/ | M, D | 200 | Search and title pages worked; `stream.sunplex.net` media timed out. |
| FastPlex | https://fastplex.net/ | M | 200 | Directory linking to ICC FTP, DhakaFlix, and CityPlex; not a separate media source. |
| CTG Movies | https://ctgmovies.com/ | M, D, N | 200 | Search, movie and episode pages, and media HEAD checks worked; added as a source. |
| MyMovieBazar | http://mymoviebazar.net/ | M | 200 after HTTPS redirect | Web app loaded; media extraction untested. |
| Nagordola CDN | https://cdn.nagordola.com.bd/ | P | 403 at root | PotFlix references this CDN; its root does not expose an index. |
| SunPlex storage | https://storage.sunplex.net/ | D | Timed out | Listed as a media storage endpoint. |
| FMFTP | https://fmftp.net/ | N | Timed out | Cloudstream provider documents a search API and stream redirects. |
| ABCFlix | http://abcflixbd.com/ | M | 200 | Returned a short “Loading...” page; media access untested. |
| E-Box file server | http://fileserver.ebox.live/ | M, D | Timed out | May be ISP restricted. |
| E-Box FS | http://fs.ebox.live/ | M, D | Timed out | May be ISP restricted. |
| DOT DFLIX | http://dflix.live/ | M, D | Timed out | Separate from Discovery's DFLIX source already in the addon. |
| iHub | http://ihub.live/ | M, D | Timed out | May be ISP restricted. |
| KhulnaFlix | http://khulnaflix.net/ | M, D | Connection reset | No page verified. |
| KhulnaFlix files | http://file.khulnaflix.net/ | M, D | Connection reset | No directory verified. |
| DhakaFTP | http://dhakaftp.com/ | M, D | Connection reset | No page verified. |
| Rangdhanu FS | http://fs.rangdhanu.live/ | M, D | DNS failed | No page verified. |
| Rangdhanu Emby | http://emby.rangdhanu.live/ | M, D | DNS failed | Would need Emby API handling if available. |
| MovieHaat | http://moviehaat.net/ | M, D | Timed out | May be ISP restricted. |
| CinemaBazar | http://cinemabazar.net/ | M, D | Timed out | May be ISP restricted. |
| Tajpata files | http://file.tajpata.com/ | M, D | Connection reset | No directory verified. |
| CTG Fun media | http://media.ctgfun.com/ | M, D | Timed out | May be ISP restricted. |
| E-Village CTG | http://fs.evillagectg.com/ | M | DNS failed | No page verified. |
| SAM FTP | https://samftp.com/ | M | Timed out | May be ISP restricted. |
| CrazyCTG | http://crazyctg.com/ | M, D | Timed out | May be ISP restricted. |
| TimepassBD | http://www.timepassbd.live/ | M, D | Timed out | May be ISP restricted. |
| TimepassBD FTP | http://ftp.timepassbd.live/ | M | Timed out | May be ISP restricted. |
| MovieMela FS | http://fs.moviemela.live:8096/ | M | Timed out | Possibly an Emby endpoint. |

Avoid using these as sources without further validation: `pollyflix.com` redirected to a parked domain, `midiplex.net` redirected to a domain sale page, `dnetdrive.com` and `www.moviemela.live` loaded generic domain pages, and `www.nagordola.com.bd` showed maintenance. The GitHub lists are directories, not proof that every server still works.

The first pass requested URL roots with a five-second timeout. The second pass checked searches and media URLs for the most promising sites. It did not download full media files.

## Media checks on this PC

| Site | Search and page | Media URL | Result |
| --- | --- | --- | --- |
| DhakaFlix server 7 | Search returned Avatar files | Video HEAD returned 200 | Added to DhakaFlix source |
| CityPlex | API search returned Avatar | Video request returned 206 | Added as a source |
| CTG Movies | Search returned movies and TV episodes | Movie and episode HEAD returned 200 | Added as a source |
| AmaderFTP | Direct movie page opened using Cinemeta's movie ID | Current movie file returned 200; broken files are filtered | Added as a movie source |
| SunPlex | Search and movie page loaded | Media host timed out | Not added |
| Elaach | Search and movie page loaded | Media host timed out, including a longer retry | Not added |
| MegaFlix | Search and movie page loaded | Media host timed out, including a longer retry | Not added |
| Khulnaplex | Search and watch page loaded | Media host timed out | Not added |

The broader [monitor list](https://github.com/fam007e/bdix-server-monitor/blob/main/data/server.json) contained 580 distinct HTTP URLs. From this PC, 138 answered with an HTTP status below 400. Many were ISP websites, link directories, parked domains, or pages without an accessible video host; an HTTP 200 alone was not treated as a working Stremio source.
