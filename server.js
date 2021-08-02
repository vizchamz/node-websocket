const http = require('http');
const fs = require('fs');
const webSocketServer = require('websocket').server;

fs.readFile('client1.html', (err, html) => {
    if (err) {
        throw err;
    }

    const server = http.createServer ((req, res) => {
        res.statusCode = 200;
        res.setHeader ('content-type', 'text/html');
        res.write(html);
        res.end();
    });

    const port = process.env.PORT || 9898;

    const wsServer = new webSocketServer({
        httpServer: server
    });

    wsServer.on('request', function (request) {
        const connection = request.accept(null, request.origin);
        connection.on('message', function (message) {
            console.log('Received Message:', message.utf8Data);
            connection.sendUTF('Hi this is WebSocket server!');
        });
        connection.on('close', function (reasonCode, description) {
            console.log('Client has disconnected.');
        });
    });

    server.listen(port, () => {
        console.log('Server started on port ' + port);
    });
});