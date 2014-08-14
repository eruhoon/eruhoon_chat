var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8124);


///  SERVER OPEN  //////////////////////////////////////////////////////////////
console.log("Server is created @ 8124 Port");
function handler (req, res) {
	var requestURL = req.url;
	var requestURLCheck = /^\/*$/;
	
	if(requestURLCheck.test(requestURL) == true){
		requestURL = "/index.html";
	}

	if(requestURL == "/admin"){
		viewAdmin(req, res);
		return;
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

///  MESSAGE  //////////////////////////////////////////////////////////////////
var noticeMessage = "채팅에 오신걸 환영합니다.";

///  CONSTANTS  ////////////////////////////////////////////////////////////////
var ADMIN_PASSWORD = "marionette";

///  VARIABLE  /////////////////////////////////////////////////////////////////
var userList = [];

///  SOCKET  ///////////////////////////////////////////////////////////////////
io.sockets.on('connection', function (socket) {

	///  CHATTING  /////////////////////////////////////////////////////////////
	socket.on('addme', function(username){
		if(username.trim()=="" || username==null || username.length>20){
			return;
		}
		username = escapeTag(username);
		socket.username = username;
		socket.userip = socket.request.connection.remoteAddress;

		///  REGISTER USER  ////////////////////////////////////////////////////
		var newUser = {
			'username': socket.username,
			'userip': socket.userip
		}
		userList.push(newUser);

		socket.emit('systemChat', 'SERVER', noticeMessage);
		socket.broadcast.emit('systemChat', 'SERVER', username+' 들어왔음.');
		io.sockets.emit('afterSendChat');
		
		console.log("LOGIN : "+username+"("+socket.userip+")");
		
	});

	socket.on('onSendChat', function(data){
        if(data.trim()=="" || socket.username==null){
            return;
        }
        data = escapeTag(data);
		io.sockets.emit('chat', socket.username, data);
        io.sockets.emit('afterSendChat');
	});

	socket.on('disconnect', function(){
		io.sockets.emit('systemChat', 'SERVER', socket.username + ' 나갔음.');
		io.sockets.emit('afterSendChat');
		console.log("LOGOUT : "+socket.username);
		
	});

});


///  FUNCTION  /////////////////////////////////////////////////////////////////
function escapeTag(str){
	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function viewAdmin(req, res){
	console.log(req.method);
	res.writeHead(200);
	res.end(JSON.stringify(userList));
}