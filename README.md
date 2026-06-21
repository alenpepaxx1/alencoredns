# AlenDNS Core

AlenDNS Core is a highly advanced, full-stack network traffic, filtering, and DNS orchestration application. It features real-time network interception capabilities, zero-trust security policies, advanced geo-blocking, real-time threat intelligence, parental control, and bandwidth monitoring.
<a href="https://ibb.co/zpGwnNR"><img src="https://i.ibb.co/Dh5nVLC/screencapture-localhost-3000-2026-06-21-05-34-56.png" alt="screencapture-localhost-3000-2026-06-21-05-34-56" border="0"></a>

## Features
- **Real-Time DNS Dashboard:** Live metrics, latency tracking, threat drops, and system status.
- **Client Registry:** Auto-discover network nodes, define monthly data usage quotas per client, monitor real-time bandwidth consumption, and assign custom network policies (from "Ad-Block Only" to "Total Monitoring").
- **Security & Geo-Blocking:** Global heatmaps displaying real-time traffic origination and drop points, country/continent-level geo-blocking rules, and real-time DNS Health / Resolver Matrix.
- **AdBlock & Parental Control:** Real-time adblock list syncing, aggressive parental filters (safe search, YouTube restricted mode), and deep manual/regex pattern blocks for traffic sanitation.
- **Custom DNS Routing:** Create manual DNS records, loopbacks, and network gateways.
- **WireGuard VPN Intregation:** Set up and manage VPN settings for connected nodes.

## Technology Stack
- **Frontend:** React 19, Tailwind CSS v4, Lucide React (Icons), Recharts (Data Visualization), Framer Motion (Animations).
- **Backend:** Node.js, Express, Socket.io (for real-time dashboard updates), custom DNS resolver logic in development.
- **Bundling & Tooling:** Vite & esbuild for fast full-stack builds, TSX for seamless execution.

## Getting Started

Make sure you have Node installed, and run:

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Your server will be running on port `3000`. When using the full-stack built applet, DNS logs will stream live via WebSocket connections.

## Build for Production

To build the client SPA and bundle the Express server into a single artifact:

```bash
npm run build
```

Then start the production server:
```bash
npm run start
```
