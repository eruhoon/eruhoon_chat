///  LOAD MODULE  //////////////////////////////////////////////////////////////
var app = require('http').createServer(handler);
var path = require('path');
var io = require('socket.io').listen(app);
var fs = require('fs');
var cookie = require('cookie');

app.listen(8124);


///  MESSAGE  //////////////////////////////////////////////////////////////////
var noticeMessage = function(){ return "채팅에 오신걸 환영합니다."; }
var connectMessage = function(_uname){ return _uname+' 들어왔음.'; }
var disconnectMessage = function(_uname){ return _uname+' 나갔음.'; }
var changeNameMsg = function(_pn, _nn){ return _pn+'에서 '+_nn+'으로 닉변.'; }


///  CONSTANTS  ////////////////////////////////////////////////////////////////
var ADMIN_PASSWORD = "marionette";
var MIME_TYPE = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.htm' : 'text/html',
	'.css' : 'text/css'
};


///  VARIABLE  /////////////////////////////////////////////////////////////////
var userList = [];


///  SERVER OPEN  //////////////////////////////////////////////////////////////
console.log("Server is created @ 8124 Port");
function handler (req, res) {
	var fileDir = path.dirname(decodeURI(req.url));
	var fileName = path.basename(decodeURI(req.url)) || 'index.html';
	var contentFile = 'html/' + fileName;

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

		var headers = {
			'Content-type' : MIME_TYPE[path.extname(fileName)]
		}

		res.writeHead(200, headers);
		res.end(data);
	});
}


///  SOCKET  ///////////////////////////////////////////////////////////////////
io.sockets.on('connection', function (socket) {

	///  ADD ME  ///
	socket.on('addme', function(_username){

		var userip = socket.request.connection.remoteAddress;
		var username = _username;

		if(!validateUserName(username)){
			username = 'GUEST';
		}
		username = escapeTag(username);

		socket.username = username;
		socket.userip = socket.request.connection.remoteAddress;

		var newUser = {
			'username': username,
			'userip': userip
		}
		userList.push(newUser);

		socket.emit('systemChat', noticeMessage());
		socket.broadcast.emit('systemChat', connectMessage(username));
		io.sockets.emit('afterSendChat');
		
		console.log("LOGIN : " + username + "("+userip+")");
		
	});

	///  CHANGE NICKNAME ///
	socket.on('onChangeName', function(_pn, _nn){
		socket.username = _nn;
		io.sockets.emit('systemChat', changeNameMsg(_pn, _nn));
		io.sockets.emit('afterSendChat');

		console.log("[NICKNAME]" + _pn + " -> " + _nn);		
	});

	///  CHAT  ///
	socket.on('onSendChat', function(_data){

		var data = _data;
		var username = socket.username;
		var userip = socket.userip;

        if(data.trim()=="" || data==null){
            return;
        }
        data = escapeTag(data);
        data = processText(data);

		io.sockets.emit('chat', username, data);
        io.sockets.emit('afterSendChat');

		console.log("[CHAT]" + username + "(" + userip + "): " + data);
	});

	///  DISCONNECT  ///
	socket.on('disconnect', function(){
		var username = socket.username;
		io.sockets.emit('systemChat', disconnectMessage(username));
		io.sockets.emit('afterSendChat');

		console.log("LOGOUT : " + username);
	});

});


///  FUNCTION  /////////////////////////////////////////////////////////////////
function processText(str){
	if(str.length > 120) str = str.substring(0, 120);
	return str;
}

function escapeTag(str){
	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function validateUserName(_username){
	if(_username=="") return false;
	if(_username==null) return false;
	if(_username.trim()=="") return false;
	if(_username.length>20) return false;
	return true;
}


function viewAdmin(req, res){
	console.log(req.method);
	res.writeHead(200);
	res.end(JSON.stringify(userList));
}

