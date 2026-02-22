const http = require('node:http');
const crypto = require('node:crypto');

// Generate 10MB of random "junk" data
const largeData = crypto.randomBytes(1024 * 1024 * 10); 

const options = {
  port: 1337,
  host: '127.0.0.1',
  method: 'CONNECT',
  path: 'httpbin.org:80', // A useful site for testing requests
};

const req = http.request(options);
req.end();

req.on('connect', (res, socket, head) => {
  console.log('Tunnel open. Sending 10MB...');

  // Construct a large POST request manually
  socket.write('POST /post HTTP/1.1\r\n' +
               'Host: httpbin.org\r\n' +
               'Content-Length: ' + largeData.length + '\r\n' +
               'Connection: close\r\n' +
               '\r\n');

  // Send the data in chunks to simulate a real upload
  socket.write(largeData);

  socket.on('data', (chunk) => {
    console.log(`Received back: ${chunk.length} bytes`);
  });

  socket.on('end', () => {
    console.log('Large transfer complete.');
  });
});