//var socket = io.connect('http://210.118.74.154:8124');
var socket = io.connect('http://localhost:8124');

socket.on('connect', function(){
	var username = "";
	while(username=="" || username==null || username.length>20){
		username = prompt('Who are you?');
	}
	socket.emit('addme', username);
});

socket.on('chat', function(username, data){
	makeChatCloud(username, data);
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
	var viewWidth = window.innerWidth;
	var chatdataMargin = 30;
	var chatdataWidth = viewWidth - chatdataMargin;
	var inputboxHeight = document.getElementsByClassName('chatting_inputbox')[0].clientHeight;

	for(var i=0; i<document.getElementsByClassName('chatdata').length; i++){
		document.getElementsByClassName('chatdata')[i].style.width = chatdataWidth + "px";
	}
	document.getElementById('chatContainer').style.height = (viewHeight - inputboxHeight) + "px";
}


var makeChatCloud = function(username, data){
	var newCloud = document.createElement('div');
    var nameDiv = document.createElement('div');
    var chatDiv = document.createElement('div');

    var chatp = document.createElement('p');
    
    nameDiv.innerHTML = username;
    chatp.innerHTML = data;

	nameDiv.className = 'chatname';
    chatDiv.className = 'chatdata';

    chatDiv.appendChild(chatp);

    newCloud.appendChild(nameDiv);
    newCloud.appendChild(chatDiv);

	document.getElementById('chatContainer').appendChild(newCloud);

	resize();
}