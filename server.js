var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8124);

console.log("Server is created @ 8124 Port");

function handler (req, res) {
	var requestURL = req.url;
	var requestURLCheck = /^\/*$/;
	
	if(requestURLCheck.test(requestURL) == true){
		requestURL = "/index.html";
	}
	
	fs.readFile(__dirname + requestURL, function (err, data){
		if(err){
			res.writeHead(500);
			return res.end('Loading Error');
		}
		res.writeHead(200);
		res.end(data);
	});

}



io.sockets.on('connection', function (socket) {

	socket.on('addme', function(username){
		if(username=="" || username==null || username.length>20){
			return;
		}
		username = username.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		socket.username = username;
		socket.emit('chat', 'SERVER', 'You Have connected');
		socket.broadcast.emit('chat', 'SERVER', username+' is on deck');
		io.sockets.emit('afterSendChat');
		socket.userip = socket.request.connection.remoteAddress;
		console.log("LOGIN : "+username+"("+socket.userip+")");
	});

	socket.on('onSendChat', function(data){
        if(data.trim()=="" || socket.username==null){
            return;
        }
        data = data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		io.sockets.emit('chat', socket.username, data);
        io.sockets.emit('afterSendChat');
	});
              

	socket.on('disconnect', function(){
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left the building');
		io.sockets.emit('afterSendChat');
		console.log("LOGOUT : "+socket.username);
	});

});
