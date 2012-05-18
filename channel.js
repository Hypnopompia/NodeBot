var Channel = exports.Channel = function(irc, name) {
	this.irc = irc;

	this.name = name;
	this.users = [];

	this.joinChannel();
}

Channel.prototype.joinChannel = function() {
	this.irc.raw('JOIN', this.name);
}

Channel.prototype.send = function(msg) {
	this.irc.send(this.name, msg);
}

Channel.prototype.userJoin = function(nick) {
	if (this.users.indexOf(nick) >= 0) { // The user is already in the channel
		return;
	}

	this.users.push(nick);
}

Channel.prototype.userKick = function(nick) {
	if (this.users.indexOf(nick) > -1) {
		this.users.splice(this.users.indexOf(nick), 1);
	}
}

Channel.prototype.userPart = function(nick) {
	if (this.users.indexOf(nick) > -1) {
		this.users.splice(this.users.indexOf(nick), 1);
	}
}

Channel.prototype.userNickChange = function(nick, newNick) {
	if (this.users.indexOf(nick) > -1) {
		this.users.splice(this.users.indexOf(nick), 1);
		this.users.push(newNick);
	}
}

Channel.prototype.userQuit = function(nick) {
	if (this.users.indexOf(nick) > -1) {
		this.users.splice(this.users.indexOf(nick), 1);
	}
}
