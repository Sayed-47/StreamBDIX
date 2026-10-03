# 🎬 StreamBDIX
**Stremio addon for streaming from BDIX sites.**

---

## 🔍 What It Does

• Fetches movies and series from BDIX sites based on what you select in Stremio  
• Shows available streams with quality info (1080p, 4K, BluRay, etc.)  
• Lets you play directly in Stremio from BDIX

---

## ⚡ Quick Start

```
npx streamiobdix
```

> Requires **[Stremio](https://www.stremio.com/downloads)**  
> Requires **[Node.js](https://nodejs.org/en/download)** 14+

---

## 🌐 Sources

- [DFLIX](https://discoveryftp.net/)
- [DhakaFlix](http://172.16.50.12)
- [RoarZone](https://roarzone.info)
- [FTPBD](https://ftpbd.net)
- [CircleFTP](http://new.circleftp.net)
- [ICC FTP](http://10.16.100.244)
- [CityPlex](https://cityplex.live/)
- [CTG Movies](https://ctgmovies.com/)

---

## ☁️ Cloudflare Tunnel (Optional)

Access your addon from anywhere using Cloudflare Tunnel.

1. Install cloudflared: `npm install -g cloudflared`
2. Create a tunnel at [Cloudflare Zero Trust](https://one.dash.cloudflare.com)
3. Paste your tunnel token in the web UI

---

## ⚠️ Important

• Run before Stremio startup — the addon must be running to fetch streams  
• Press Ctrl+C to stop the addon

---

## 🛠️ Troubleshooting

**No streams found?**  
• Make sure the addon is running (`npx streamiobdix`)
• Check if the BDIX sites are reachable  
• The content might not be available

**Streams not playing?**  
• Try a different source/quality option

---

**Made for BDIX users**
