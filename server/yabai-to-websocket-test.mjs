// yabai --verbose | node yabai-to-websocket.js
import WebSocket, { WebSocketServer } from 'ws';
import readline from 'readline'

const port = 9034

const ws = new WebSocket(`ws://127.0.0.1:${port}/path`);

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
