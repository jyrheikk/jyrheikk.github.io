function Timer() {
	this.total = 0;
	this.then = undefined;
	this.start(); 
}

Timer.prototype.now = function() {
	return new Date().getTime();
};

Timer.prototype.start = function() {
	this.then = this.now();
};

Timer.prototype.stop = function() {
	this.total += this.now() - this.then;
};

Timer.prototype.show = function() {
	alert("Timer: " + this.total + " ms");
};
