//var socket = io.connect('http://210.118.74.154:8124/page/admin.html');
//var socket = io.connect('http://localhost:8124');

socket.on('connect', function(){
	var password = prompt('비밀번호?');
	socket.emit('adminLogin', password);
});

socket.on('showAdminView', function(userList){
	alert(userList);
});