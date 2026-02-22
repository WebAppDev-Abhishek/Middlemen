const http = require('node:http');

const options = {
  port: 1337,
  host: '127.0.0.1',
  method: 'CONNECT',
  path: 'www.google.com:80', // The destination we want to reach
};

const req = http.request(options);
req.end();

req.on('connect', (res, socket, head) => {
  console.log('[Client] Tunnel established!');

  // Now we send a raw HTTP GET request through the socket (the tunnel)
  socket.write('GET / HTTP/1.1\r\n' +
               'Host: www.google.com\r\n' +
               'Connection: close\r\n' +
               '\r\n');

  socket.on('data', (chunk) => {
    console.log('[Client] Received data from destination:\n');
    console.log(chunk.toString().substring(0, 200) + '...'); // Show first 200 chars
  });

  socket.on('end', () => {
    console.log('[Client] Connection closed.');
    process.exit();
  });
});