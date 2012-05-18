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
	var channelName = msg.arguments[0]
	  , channel = this.irc.channels[channelName]
	  , userList = channel.users // List of all the users in the current channel
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
