
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

var counter;


app.listen(8124);


function handler (req, res) {
	fs.readFile(__dirname + '/index.html', function (err, data){
		if(err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		counter = 1;
		res.writeHead(200);
		res.end(data);
	});

}

io.sockets.on('connection', function (socket) {
	socket.on('addme', function(username){
		socket.username = username;
		socket.emit('chat', 'SERVER', 'You Have connected');
		socket.broadcast.emit('chat', 'SERVER', username+' is on deck');
	});

	socket.on('sendchat', function(data){
		io.sockets.emit('chat', socket.username, data);
	});

	socket.on('disconnect', function(){
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
	});

});
