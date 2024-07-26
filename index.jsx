import * as Uebersicht from "uebersicht";
import { spawn } from 'child_process';
import x from 'child_process';
import fs from 'fs';
import readline from 'readline'

const widget_name = "YabaySpacesSimple"
const yabay_log = '/tmp/yabai-log'
const { React } = Uebersicht;

const initialState = () => {
  return {
    space: "unknown",
    spaces: {}
  }
}

const port = 9034
const read_from_websocket = (cb_on_line) => {
    const connect = () => {
    let ws = new WebSocket(`ws://127.0.0.1:${port}/path`);

        ws.onopen = () => console.log('Connected to WebSocket server');
        ws.onmessage = (event) => cb_on_line({last: event.data});
        ws.onclose = () => {
            cb_on_line(null, 'Disconnected from WebSocket server, will retry in 500 ms');
            console.log('Disconnected from WebSocket server, will retry in 500 ms');
            setTimeout(() => connect(), 500);
        };
        ws.onerror = (error) => console.error('WebSocket error:', error);
    }
  connect();
}

// export const command = "whoami";
export const command  = (callback) => {
    callback({output: initialState()})
    read_from_websocket( callback)
    // callback("onth")
    // read_using_readline(yabay_log, callback)
}

// the refresh frequency in milliseconds
export const refreshFrequency = false;

// the CSS style for this widget, written using Emotion
// https://emotion.sh/
export const className =`
  top: 10%;
  left: 39px;
  right: 0;
  width: 340px;
  box-sizing: border-box;
  // margin: auto;
  padding: 120px 20px 20px;
  background-color: rgba(255, 255, 255, 0.9);
  background-image: url('logo.png');
  background-repeat: no-repeat;
  background-size: 176px 84px;
  background-position: 50% 20px;
  -webkit-backdrop-filter: blur(20px);
  color: #141f33;
  font-family: Helvetica Neue;
  font-weight: 300;
  border: 2px solid #fff;
  border-radius: 1px;
  text-align: justify;
  line-height: 1.5;

  h1 {
    font-size: 20px;
    margin: 16px 0 8px;
  }

  em {
    font-weight: 400;
    font-style: normal;
  }
`

export const updateState = (event, previous) => {
  let m
  if (event.last){
    if (m = event.last.match(/EVENT_HANDLER_DAEMON_MESSAGE: space --focus (.*)/)){
      const space = m[1]
      previous.space = space
      previous.spaces = previous.spaces || {}
      previous.spaces[space] = true
    }
  }
  return previous
}

export const render = (args) => {

    return (
        <div>
        <input autoFocus></input>
      {JSON.stringify(args)}
        <div>SPACE: {args.space}</div>
        <div>SPACES: {Object.keys(args.spaces).join(', ')}</div>
    </div>
    );
}



// const read_using_readline = (path, cb_on_line) => {
//     cb_on_line(Object.keys(fs))
//     cb_on_line("bc")
//     cb_on_line("bc")
//     return;
//     // cb_on_line({output: Object.keys(fs)})
//     const stream = fs.createReadStream(path, { encoding: 'utf8', flags: 'r' });
//     // Use readline to process the file line by line
//     const rl = readline.createInterface({
//         input: stream,
//         output: process.stdout,
//         terminal: false
//     });
//     rl.on('line', (line) => {
//         cb_on_line(line)
//     });

// }


// export const read_using_tail = (path, cb_on_line) => {
//   const tail = spawn('tail', ['-f', '--retry', path]);
//   let partial = ''
//   tail.stdout.on('data', (data) => {
//     const lines = data.split("\n")
//     lines[0] = partial + lines[0]
//     partial = lines.pop()
//     for (let v of lines) {
//         callback(v)
//     }
//   });

//   tail.stdout.on('err', (data) => console.err(`${widget_name}: ${err}`))
//   tail.stdout.on('close', (data) => console.log('tail quit? - should not happen'))
// }


