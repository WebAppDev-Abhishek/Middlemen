const http = require('node:http');
const net = require('node:net');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const dashboardServer = http.createServer(app);
const io = new Server(dashboardServer);

// Serve the visual dashboard
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// --- THE PROXY LOGIC ---
const proxy = http.createServer();

proxy.on('connect', (req, clientSocket, head) => {
    // 1. Safe Parsing of the URL
    const parts = req.url.split(':');
    const hostname = parts[0];
    const port = parts[1] || 80;

    console.log(`[Proxy] Requesting tunnel to: ${hostname}:${port}`);
    io.emit('status', { msg: `Connecting to ${hostname}...`, type: 'info' });

    // 2. Handle Client Socket Errors (Prevents ECONNRESET crashes)
    clientSocket.on('error', (err) => {
        console.error(`[Client Error] ${err.code}`);
        io.emit('status', { msg: `Client disconnected: ${err.code}`, type: 'error' });
    });

    // 3. Establish connection to the Target Website
    const serverSocket = net.connect(port, hostname, () => {
        // Success! Notify client and UI
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        serverSocket.write(head);
        
        io.emit('status', { msg: `Tunnel Active: ${hostname}`, type: 'success' });

        // Stream Outward Data (Client -> Target)
        clientSocket.on('data', (chunk) => {
            io.emit('data-flow', { 
                direction: 'outward', 
                size: chunk.length, 
                target: hostname,
                preview: chunk.toString().substring(0, 50).replace(/[^\x20-\x7E]/g, '.') 
            });
        });

        // Stream Inward Data (Target -> Client)
        serverSocket.on('data', (chunk) => {
            io.emit('data-flow', { 
                direction: 'inward', 
                size: chunk.length, 
                target: hostname,
                preview: chunk.toString().substring(0, 50).replace(/[^\x20-\x7E]/g, '.') 
            });
        });

        // 4. Create the Bi-directional Pipe
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    // 5. Handle Target Server Errors
    serverSocket.on('error', (err) => {
        console.error(`[Target Error] ${err.code} for ${hostname}`);
        io.emit('status', { msg: `Failed to reach ${hostname}: ${err.code}`, type: 'error' });
        clientSocket.end();
    });

    // Clean up when the tunnel closes
    serverSocket.on('end', () => io.emit('status', { msg: `Tunnel closed for ${hostname}`, type: 'info' }));
});

// Start the Dashboard
dashboardServer.listen(3000, () => {
    console.log('--------------------------------------------');
    console.log('📊 DASHBOARD: http://localhost:3000');
    console.log('🛰️  PROXY TUNNEL: 127.0.0.1:1337');
    console.log('--------------------------------------------');
});

// Start the Proxy
proxy.listen(1337);