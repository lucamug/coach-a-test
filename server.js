// This scrpit set up a server for the REST API and for the Websockets
// It also serve files form the public folder, by default
var port = 4000;
var jsonServer = require('json-server');
var app = jsonServer.create();
var server = app.listen(port);
var router = jsonServer.router('db.json');
var io = require('socket.io')(server);
app.use(jsonServer.defaults());
app.use(router);
io.sockets.on('connection', function(socket) {
    socket.on('mousemove', function(data) {
        socket.broadcast.emit('moving', data);
    });
});
console.log('Listening at http://localhost:' + port);
