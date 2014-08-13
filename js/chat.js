var socket = io.connect('http://210.118.74.154:8124');

socket.on('connect', function(){
	var username = "";
	while(username=="" || username==null){
		username = prompt('Who are you?');
	}
	socket.emit('addme', username);
});

socket.on('chat', function(username, data){
	var p = document.createElement('p');
    
	p.innerHTML = username + ': ' + data;
	document.getElementById('chatContainer').appendChild(p);
});

socket.on('afterSendChat',function(){
    scrollDown();
})

window.addEventListener('load', function(){
	resize();
	document.getElementById('chatData').addEventListener('keypress', function(event){
		enter_press(event);
	});
}, false);

window.addEventListener('resize', function(){
	resize();
}, false)



var sendChat = function(){
    var text = document.getElementById('chatData').value;
	document.getElementById('chatData').value = "";
	socket.emit('onSendChat', text);
}
        
var scrollDown = function(){
	var chatContainer = document.getElementById('chatContainer');
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

var enter_press = function(event){
	if(event.keyCode == 13){
		sendChat();
	}
}

var resize = function(){
	var viewHeight = window.innerHeight;
	var inputboxHeight = document.getElementsByClassName('chatting_inputbox')[0].clientHeight;

	var chatContainer = document.getElementById('chatContainer');
	chatContainer.style.height = (viewHeight - inputboxHeight) + "px";
}