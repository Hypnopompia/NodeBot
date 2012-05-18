/**
 * Poke
 * 
 * @author	thunter
 * @website
 * @copyright thunter
 */

Plugin = exports.Plugin = function(irc) {
	this.name = 'freenode';
	this.irc = irc;
};

Plugin.prototype.onReady = function(){
	if (this.irc.config.nickServPass) {
		this.irc.raw('NS id ' + this.irc.config.nickServPass);
	}
};

/*

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
