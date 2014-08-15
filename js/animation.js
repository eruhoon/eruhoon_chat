function fadeOut(element) {
	if(isMobile()) return;
	var op = element.style.opacity;
	var timer = setInterval(function () {
		if (op <= 0.1){
			clearInterval(timer);
			op = 0;
		}
		element.style.opacity = op;
		op -= 0.2;
		
	}, 50);
}

function fadeIn(element){
	if(isMobile()) return;
	var op = parseFloat(element.style.opacity);
	var timer = setInterval(function(){
		if (op >= 0.9){
			clearInterval(timer);
			op = 1;
		}
		element.style.opacity = op;
		op += 0.2;
	}, 50);
}



