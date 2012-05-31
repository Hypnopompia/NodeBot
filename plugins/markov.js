/**
 * Markov
 * 
 * @author	thunter
 * @website
 * @copyright thunter
 */

var fs = require("fs");

Plugin = exports.Plugin = function(irc) {
	this.name = 'markov';
	this.irc = irc;
	this.chanCount = {};

	this.irc.addTrigger(this, 'markov', this.markov);
};

Plugin.prototype.markov = function(msg) {
	var that = this
	  , channelName = msg.arguments[0].toLowerCase()
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}

	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , nicks = [];
	
	// channel.send('Hey ' + nicks.sort().join(', ') + '!');
	fs.readFile(channelName + '.log', 'utf8', function(err, text){
		channel.send(that.getMarkov(text));
	});
	
}

Plugin.prototype.onMessage = function(channelName, nick, message) {
	var that = this
	  , channel = this.irc.channels[channelName] || false
	  , botNick = this.irc.botNick.toLowerCase();
	
	if (message.toLowerCase().indexOf(botNick) == 0) {
		if (channel) {
			fs.readFile(channelName + '.log', 'utf8', function(err, text){
				channel.send(that.getMarkov(text));
			});
		}
	}

	if (message.length > 5 && message.substring(0,1) != this.irc.triggerPrefix) {
		var log = fs.createWriteStream(channelName + '.log', {'flags': 'a'});
		log.end(message + "\n");
	}

	if (this.chanCount[channelName]) {
		this.chanCount[channelName] += 1;
		
		if (this.chanCount[channelName] >= 50) {
			this.chanCount[channelName] = 0;
			if (channel) {
				fs.readFile(channelName + '.log', 'utf8', function(err, text){
					channel.send(that.getMarkov(text));
				});
			}
		}
	} else {
		this.chanCount[channelName] = 1;
	}
};

Plugin.prototype.randomProp = function(obj) {
	var result
	  , count = 0;

	for (var prop in obj)
		if (Math.random() < 1/++count)
			result = prop;

	return result;
};

Plugin.prototype.getNext = function(obj) {
	var sum = 0
	  , min = 1
	  , count = 0
	  , rand
	  , result;

	for (p in obj) {
		sum += obj[p];
	}

	rand = Math.floor(Math.random() * (sum - min + 1) + min);
	for (var prop in obj) {
		if (rand <= obj[prop] ) {
			return prop;
		} else {
			rand -= obj[prop];
		}
	}

	return result;
};

Plugin.prototype.getMarkov = function(text) {
	var look = 4
	  , length = 1000
	  , table = {}
	  , start;
	
	for (var i=0; i < text.length; i++) {
		var key = text.substring(i, i + look);
		if (table[key] === undefined) {
			table[key] = {};
		}
	}

	for (var j=0; j < text.length - look; j++) {
		var key = text.substring(j, j + look);
		var next = text.substring(j + look, j + look + look);

		if (table[key][next] === undefined) {
			table[key][next] = 1;
		} else {
			table[key][next] += 1;
		}
	}

	start = this.randomProp(table);
	var out = start;
	var next;

	for (var k=0; k < (length / look); k++) {
		next = this.getNext(table[start]);
		if (next) {
			start = next;
			out = out + next;
		} else {
			start = this.randomProp(table);
		}
	}

	var outList = out.split("\n");
	outList.shift();
	outList.pop();

	var num = Math.floor(Math.random()*(outList.length - 1));
	var markov = outList[num];

	return markov;
};
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
