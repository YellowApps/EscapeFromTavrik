var WScript = {

	CreateObject: function(name){
		return new ActiveXObject(name);
	},

	Sleep: function(time){
		var d = Date.now();
		while(Date.now() - d < time);				
	},

	Echo: function(txt){
		alert(txt);
	}
}

function resize(w, h){
    winWidth = w;
    winHeight = h;

    window.resizeTo(winWidth, winHeight);
    window.moveTo(screen.width / 2 - winWidth / 2, screen.height / 2 - winHeight / 2);
}

String.prototype.replaceAll = function(what, to){
	return this.split(what).join(to);
}

String.prototype.includes = function(search, start){
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
}

window.console = {
	log: function(){}
}