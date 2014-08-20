///  LOAD MODULE  //////////////////////////////////////////////////////////////
var app = require('http').createServer(handler);
var path = require('path');
var io = require('socket.io').listen(app);
var fs = require('fs');
var cookie = require('cookie');

app.listen(8124);

setInterval(function() {
    gc();
}, 30000);

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
	socket.on('addme', function(_user){
		
		var userip = socket.request.connection.remoteAddress;
		var nickname = _user.nickname;
		
		if(!validateUserName(nickname)){
			nickname = 'GUEST';
		}
		nickname = escapeTag(nickname);

		var newUser = {
			nickname: nickname,
			icon: _user.icon,
			ip: userip
		}

		socket.userStatus = newUser;
		userList.push(newUser);

		socket.emit('systemChat', noticeMessage());
		socket.broadcast.emit('systemChat', connectMessage(nickname));
		io.sockets.emit('afterSendChat');
		
		console.log("LOGIN : " + nickname + "("+userip+")");
		
	});

	///  CHANGE NICKNAME ///
	socket.on('onChangeName', function(_pn, _nn){
		var pastName = escapeTag(_pn);
		var newName = escapeTag(_nn);
		socket.userStatus.nickname = newName;
		io.sockets.emit('systemChat', changeNameMsg(pastName, newName));
		io.sockets.emit('afterSendChat');

		console.log("[NICKNAME]" + pastName + " -> " + newName);		
	});

	///  CHAT  ///
	socket.on('onSendChat', function(_data){

		var data = _data;
		var nickname = socket.userStatus.nickname;
		var userip = socket.userStatus.ip;

		if(data.trim()=="" || data==null){
			return;
		}
		data = escapeTag(data);
		data = processText(data);

		var user = {
			nickname: nickname,
			icon: socket.userStatus.icon
		};
		io.sockets.emit('chat', user, data);
		io.sockets.emit('afterSendChat');

		console.log("[CHAT]" + nickname + "(" + userip + "): " + data);
	});

	///  DISCONNECT  ///
	socket.on('disconnect', function(){
		if(socket.userStatus==undefined) return;
		var nickname = socket.userStatus.nickname;
		if(!validateUserName(nickname)) return;
		io.sockets.emit('systemChat', disconnectMessage(nickname));
		io.sockets.emit('afterSendChat');

		console.log("LOGOUT : " + nickname);
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

