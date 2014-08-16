///  CONSTANTS  ////////////////////////////////////////////////////////////////
var MAX_HISTORY = 50;


///  VARIABLE  /////////////////////////////////////////////////////////////////
var inputHistory = [''];
var historyIndex = 0;


///  GET USER NAME  ////////////////////////////////////////////////////////////
var getUserName = function(){
	var username = getCookie('username');
	if(!validateUserName(username)){
		username = askUserName(true);
	}
	return username;
}


///  ASK USER NAME  ////////////////////////////////////////////////////////////
var askUserName = function(cancel){
	var username = "";
	while(!validateUserName(username)){
		username = prompt('누구셈?');
		if(cancel && username == null){
			break;
		}
	}
	return username;
}


///  SAVE USER NAME  ///////////////////////////////////////////////////////////
var saveUserName = function(_username){
	expiresYear = 5;
	if(_username == null) _username = 'GUEST';
	setCookie('username', _username, expiresYear*365);
}


///  VALIDATION USER NAME  /////////////////////////////////////////////////////
var validateUserName = function(_username){
	if(_username=="") return false;
	if(_username==null) return false;
	if(_username.trim()=="") return false;
	if(_username.length>20) return false;
	return true;
}


///  SCROLL DOWN  //////////////////////////////////////////////////////////////
var scrollDown = function(){
	var chatContainer = document.getElementById('chatContainer');
	chatContainer.scrollTop = chatContainer.scrollHeight;
}


///  CHAT KEY EVENT  ///////////////////////////////////////////////////////////
var chatKeyEvent = function(event){
	switch(event.keyCode){
		case 13: // ENTER
			sendChat();
			break;
		case 38: // UP
			event.target.value = getHistory(historyIndex+1);
			break;
		case 40: // DOWN
			event.target.value = getHistory(historyIndex-1);
			break;
	}
}


///  RESIZE  ///////////////////////////////////////////////////////////////////
var resize = function(){
	var chatBalloonDiv = document.getElementsByClassName('chatballoon');
	var chatDataDiv = document.getElementsByClassName('chatdata');
	
	var viewHeight = window.innerHeight;
	var viewWidth = window.innerWidth;
	var chatballoonMargin = 70;
	var chatdataMargin = 30;
	var chatballoonWidth = viewWidth - chatballoonMargin;
	var chatdataWidth = chatballoonWidth - chatdataMargin;
	var inputboxHeight = document.getElementsByClassName('chatting_inputbox')[0].clientHeight;

	for(var i=0; i<chatDataDiv.length; i++){
		chatBalloonDiv[i].style.width = chatballoonWidth + "px";
		chatDataDiv[i].style.width = chatdataWidth + "px";
	}

	var chatContainer = document.getElementById('chatContainer');
	chatContainer.style.height = (viewHeight - inputboxHeight) + "px";
}


///  SYSTEM CHAT CLOUD  ////////////////////////////////////////////////////////
var makeSystemCloud = function(data){
	var newCloud = document.createElement('div');
	newCloud.className = 'chatsystem';
	newCloud.innerHTML = "[SYSTEM] " + data;
	document.getElementById('chatContainer').appendChild(newCloud);
	resize();	
}


///  CHATTING CLOUD  ///////////////////////////////////////////////////////////
var makeChatCloud = function(_username, _text){
	var myName = getCookie('username');

	var newCloud = document.createElement('div');
	var chatBalloonDiv = document.createElement('div');
	var profilePicDiv = document.createElement('div');
	var nameDiv = document.createElement('div');
	var chatDiv = document.createElement('div');

	var chatp = document.createElement('p');
    
    nameDiv.innerHTML = _username;
    chatp.innerHTML = _text;

	nameDiv.className = 'chatname';
    chatDiv.className = 'chatdata';
    profilePicDiv.style.float = 'left';
    if(myName == _username){
    	profilePicDiv.style.float = 'right';
    	nameDiv.style.float = 'right';
    	chatDiv.style.textAlign = 'right';
    }

    chatDiv.appendChild(chatp);

	profilePicDiv.className = 'profile_picture';
	profilePicDiv.innerHTML = '<img class="profile_picimg" src="'+'/asset/default.png'+'">';

    chatBalloonDiv.className = 'chatballoon';
    chatBalloonDiv.appendChild(nameDiv);
    chatBalloonDiv.appendChild(chatDiv);

    newCloud.className = 'chatcloud';
    newCloud.appendChild(profilePicDiv);
    newCloud.appendChild(chatBalloonDiv);

	document.getElementById('chatContainer').appendChild(newCloud);

	resize();
}


///  GET COOKIE  ///////////////////////////////////////////////////////////////
var getCookie = function(_cname) {
    var name = _cname + "=";
    var cookieArray = document.cookie.split(';');
    for(var i=0; i<cookieArray.length; i++) {
        var c = cookieArray[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}


///  SET COOKIE  ///////////////////////////////////////////////////////////////
var setCookie = function(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


///  ADD HISTORY  //////////////////////////////////////////////////////////////
var addHistory = function(_text){
	inputHistory.splice(1, 0, _text);
	inputHistory.splice(MAX_HISTORY, inputHistory.length-MAX_HISTORY);
}


///  GET HISTORY  //////////////////////////////////////////////////////////////
var getHistory = function(_index){
	if(_index<0) historyIndex = 0;
	else if(_index>=inputHistory.length) historyIndex = inputHistory.length-1;
	else historyIndex = _index;

	return inputHistory[historyIndex];
}


///  SEND CHATTING  ////////////////////////////////////////////////////////////
var sendChat = function(){
    var text = document.getElementById('chatData').value;
    document.getElementById('chatData').value = "";
	socket.emit('onSendChat', text);
}


///  SEND NICKNAME  ////////////////////////////////////////////////////////////
var changeNameCallback = function(){
	var prevUsername = getCookie('username');
	var nowUsername = askUserName(true);
	if(nowUsername==null){
		return;
	}
	saveUserName(nowUsername);
	socket.emit('onChangeName', prevUsername, nowUsername);
}