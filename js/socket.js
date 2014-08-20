var socket = io.connect('http://210.118.74.154:8124');
//var socket = io.connect('http://localhost:8124');

socket.on('connect', function(){
	var myStatus = {
		nickname : User.getUserName(),
		icon : User.getUserIcon()
	}
	User.saveUserName(myStatus.nickname);
	socket.emit('addme', myStatus);
});

socket.on('systemChat', function(data){
	makeSystemCloud(data);
});

socket.on('chat', function(_n, _text){
	makeChatCloud(_n, _text);
});

socket.on('afterSendChat',function(){
    scrollDown();
});