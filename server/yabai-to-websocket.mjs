// yabai --verbose | node yabai-to-websocket.js
import WebSocket, { WebSocketServer } from 'ws';
import readline from 'readline'

const port = 9034

// Create an interface to read lines from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const wss = new WebSocketServer({
  port
})

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Read lines from stdin and send to all connected WebSocket clients
rl.on('line', (line) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(line);
    }
  });
});

console.log('WebSocket server is listening on ws://127.0.0.1:9034');
