const net = require('net');

const host = process.argv[2] || 'localhost';
const port = parseInt(process.argv[3], 10) || 5432;
const timeout = parseInt(process.argv[4], 10) || 1000; // ms

function waitForPort(host, port, timeout) {
  return new Promise((resolve) => {
    const tryConnect = () => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);
      socket.on('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.on('error', () => {
        socket.destroy();
        setTimeout(tryConnect, 500);
      });
      socket.on('timeout', () => {
        socket.destroy();
        setTimeout(tryConnect, 500);
      });
      socket.connect(port, host);
    };
    tryConnect();
  });
}

(async () => {
  console.log(`Waiting for ${host}:${port}...`);
  await waitForPort(host, port, timeout);
  console.log(`${host}:${port} is available`);
  process.exit(0);
})();
