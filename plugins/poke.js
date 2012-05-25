/**
 * Poke
 * 
 * @author	thunter
 * @website
 * @copyright thunter
 */

Plugin = exports.Plugin = function(irc) {
	this.name = 'poke';
	this.irc = irc;

	this.irc.addTrigger(this, 'poke', this.poke);
};

Plugin.prototype.poke = function(msg) {
	var channelName = msg.arguments[0].toLowerCase()
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}

	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , nicks = [];
	
	for (var i=0; i < userList.length; i++) {
		if (this.irc.botNick.toLowerCase() != userList[i]) { // Don't include the bot's nick
			nicks.push(userList[i]);
		}
	}

	channel.send('Hey ' + nicks.sort().join(', ') + '!');
}

/*

Plugin.prototype.onReady = function() {
};

Plugin.prototype.onMessage = function(channel, nick, message) {
	console.log(channel + ' <' + nick + '> ' + message);
};

Plugin.prototype.onJoin = function(channel, nick) {
	console.log(nick + ' joined ' + channel);
};

Plugin.prototype.onKick = function(channel, kickedBy, nick) {
	console.log(kickedBy + ' kicked ' + nick + ' from ' + channel);
};

Plugin.prototype.onNick = function(oldNick, nick) {
	console.log(oldNick + ' is now known as ' + nick);
};

Plugin.prototype.onPart = function(channel, nick) {
	console.log(nick + ' left ' + channel);
};

Plugin.prototype.onQuit = function(nick) {
	console.log(nick + ' quit');
};

*/
