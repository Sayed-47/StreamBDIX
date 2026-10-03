# Additional BDIX server candidates

Checked on 2026-10-03 from this Windows connection. These are public URLs collected from GitHub projects, not configured StreamBDIX sources. An HTTP response confirms only that a host answered; Stremio support also requires a working search method and direct playable media links. Timeouts may reflect ISP-specific BDIX access.

Sources: [BDIX Server Monitor list](https://github.com/fam007e/bdix-server-monitor/blob/main/data/server.json) (M), [BDIX FTP directory](https://github.com/TelepathyVijay/bdix-ftp-server/blob/main/FTP_List.md) (D), [PotFlix server configuration](https://github.com/ReduanNurLabid/PotFlix/blob/main/app/src/main/java/com/potflix/data/local/preferences/ServerConfig.kt) (P), and [Niloy Cloudstream providers](https://github.com/Niloy-Sarker/niloy-cloudstream) (N).

| Candidate | URL | Source | HTTP check | Notes |
| --- | --- | --- | --- | --- |
| SunPlex | https://sunplex.net/ | M, D | 200 | Media site loaded; search and playback untested. |
| FastPlex | https://fastplex.net/ | M | 200 | Directory linking to ICC FTP, DhakaFlix, and CityPlex; not a separate media source. |
| CTG Movies | https://ctgmovies.com/ | M, D, N | 200 | `/search?q=Avatar` returned matching movie and TV links; playback untested. |
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

Most checks requested only each URL's root with a five-second timeout. CTG Movies also had one search page check. The checks did not authenticate, inspect media links, or stream a file.
