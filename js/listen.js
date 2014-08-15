window.addEventListener('load', function(){
	resize();
	
	var chatData = document.getElementById('chatData');
	chatData.addEventListener('keydown', function(event){
		chatKeyEvent(event);
	});

	var changeNameDiv = document.getElementById('changeName');
	changeNameDiv.addEventListener('click', function(){
		changeNameCallback();
	});

	if(!isMobile())
	{
		changeNameDiv.style.opacity = 0;
		changeNameDiv.addEventListener('mouseenter', function(){
			fadeIn(changeNameDiv);
		});

		changeNameDiv.addEventListener('mouseleave', function(){
			fadeOut(changeNameDiv);
		});
	}

}, false);

window.addEventListener('resize', function(){
	resize();
}, false);


function isMobile(){
	var mobileKeyWords = new Array(
		'iPhone', 
		'iPod', 
		'BlackBerry', 
		'Android', 
		'Windows CE', 
		'LG', 
		'MOT', 
		'SAMSUNG', 
		'SonyEricsson'
	);
	for (var word in mobileKeyWords){
		if (navigator.userAgent.match(mobileKeyWords[word]) != null){
			return true;
		}
    }
	return false;
}