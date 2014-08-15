var socket = io.connect('http://210.118.74.154:8124');
//var socket = io.connect('http://localhost:8124');

socket.on('connect', function(){
	var username = getUserName();
	saveUserName(username);
	socket.emit('addme', username);
});

socket.on('systemChat', function(data){
	makeSystemCloud(data);
});

socket.on('chat', function(username, text){
	makeChatCloud(username, text);
	addHistory(text);
});

socket.on('afterSendChat',function(){
    scrollDown();
});