#!/usr/bin/env node

/**
 * BTC Monitor Dashboard Server
 * Serves the dashboard and provides API endpoints
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = path.dirname(__dirname);

// Game data (simulated - in real would read from memory files)
let gameData = {
    status: 'CLOSED',
    btcPrice: 76900,
    priceChange24h: -0.59,
    balance: 950,
    pnl: -4.95,
    operations: 1,
    btcPreserved: 0.01289,
    positions: [
        {
            id: 1,
            type: 'COMPRA',
            entry: 77569,
            exit: 73728.20,
            pnl: -4.95,
            status: 'STOP',
            date: '2026-02-02 19:15 UTC'
        }
    ],
    lastUpdated: new Date().toISOString()
};

// Load real data from memory files
function loadGameData() {
    try {
        const memPath = path.join(BASE_DIR, 'memory', 'trading-game-72h.md');
        if (fs.existsSync(memPath)) {
            const content = fs.readFileSync(memPath, 'utf8');
            // Parse relevant data from memory file
            // For now, keep static data
        }
    } catch (e) {
        console.log('Usando dados simulados');
    }
}

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

// HTTP Server
const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // API endpoints
    if (req.url === '/api/game-data' || req.url === '/api/game-data/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gameData));
        return;
    }
    
    if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'running',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));
        return;
    }
    
    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(BASE_DIR, 'btc-dashboard', 'public', filePath);
    
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`
🚀 BTC Monitor Dashboard Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 URL: http://localhost:${PORT}
📊 Dashboard: http://localhost:${PORT}/
📡 API: http://localhost:${PORT}/api/game-data
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});
