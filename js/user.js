///  USER STATUS  //////////////////////////////////////////////////////////////
var User = {

///  CONSTANTS  ////////////////////////////////////////////////////////////////
	MAX_ICON : 27,

///  GET USER ICON  ////////////////////////////////////////////////////////////	
	getUserIcon : function(){
		var userIcon = getCookie('usericon');
		if(!userIcon){
			var myIconNo = getRandomIcon();
			setCookie('usericon', userIcon);
		}
		return userIcon;
	},

///  GET RANDOM ICON  //////////////////////////////////////////////////////////
	getRandomIcon : function(){
		var iconNo = Math.floor((Math.random() * this.MAX_ICON) + 1);
		if(iconNo < 10) myIconNo = '0'+iconNo;
		userIcon = '/asset/profile_icon/'+iconNo+'.gif';
		return userIcon;
	}

///  GET USER NAME  ////////////////////////////////////////////////////////////
	getUserName : function(){
		var username = getCookie('username');
		if(!this.validateUserName(username)){
			username = askUserName(true);
		}
		return username;
	},

///  ASK USER NAME  ////////////////////////////////////////////////////////////
	askUserName : function(cancel){
		var username = "";
		while(!this.validateUserName(username)){
			username = prompt('누구셈?');
			if(cancel && username == null){
				break;
			}
		}
		return username;
	},

///  SAVE USER NAME  ///////////////////////////////////////////////////////////
	saveUserName : function(_username){
		if(_username == null) _username = 'GUEST';
		setCookie('username', _username);
	},

///  VALIDATION USER NAME  /////////////////////////////////////////////////////
	validateUserName : function(_username){
		if(_username=="") return false;
		if(_username==null) return false;
		if(_username.trim()=="") return false;
		if(_username.length>20) return false;
		return true;
	}

}


