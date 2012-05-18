/**
 * node irc bot
 * Based on the work from Michael Owens and Karl Tiedt.
 * 
 * https://github.com/ktiedt/NodeJS-IRC-Bot
 *
 *
 * @author TJ Hunter
 * @copyright TJ Hunter 2012
 */

var sys = require('util')
  , net = require('net')
  , Channel = require('./channel').Channel;

irc = exports.irc = function(options) {
	this.init(options);
};

sys.inherits(irc, process.EventEmitter);

irc.prototype.init = function(config) {
	var that = this;

	this.config = config;
	this.host = config.host || '127.0.0.1';
	this.port = config.port || 6667;
	this.botNick = config.botNick || 'NodeBot';
	this.username = config.username || 'NodeBot';
	this.realname = config.realname || 'Node Bot';
	this.triggerPrefix = config.triggerPrefix || '.';
	this.joinChannels = config.channels || [];
	this.pluginList = config.plugins || [];
	this.plugins = [];
	this.pluginTriggers = {};
	this.encoding = 'utf8';
	this.timeout = 60 * 60 * 1000;
	this.channels = {};
	this.buffer = '';

	for (var i=0; i<this.joinChannels.length; i++) {
		this.joinChannels[i] = this.joinChannels[i].toLowerCase();
	}

	this.pluginList.forEach(function(plugin){
		var Plugin = require('./plugins/' + plugin);
		that.plugins.push(new Plugin.Plugin(that));
	});
};

irc.prototype.addTrigger = function(plugin, trigger, fn) {
	if (this.pluginTriggers[trigger]) {
		this.pluginTriggers[trigger].push({plugin: plugin, callback: fn});
	} else {
		this.pluginTriggers[trigger] = [{plugin: plugin, callback: fn}];
	}
};

irc.prototype.connect = function() {
	var conn = this.conn = net.createConnection(this.port, this.host);

	conn.setEncoding(this.encoding);
	conn.setTimeout(this.timeout);

	this.on('connect', this.onConnect);
	this.on('data', this.onReceive);
	this.on('eof', this.onEOF);
	this.on('timeout', this.onTimeout);
	this.on('close', this.onClose);
};

irc.prototype.disconnect = function(reason) {
	if (this.conn.readyState !== 'closed') {
		this.conn.end();
		console.log('Disconnected: ' + reason);
	}
}

irc.prototype.onConnect = function() {
	console.log('Connected');
	this.raw('NICK', this.botNick);
	this.raw('USER', this.username, '0', '*', ':' + this.realname);
};

irc.prototype.onReceive = function(chunk) {
	this.buffer += chunk;
	while (this.buffer) {
		var offset = this.buffer.indexOf("\r\n");
		if (offset < 0) {
			return;
		}

		var msg = this.buffer.slice(0, offset);
		this.buffer = this.buffer.slice(offset + 2);

		msg = this.parse(msg);
		this.onMessage(msg);
	}
};

irc.prototype.onMessage = function(msg) {
	var target = msg.arguments[0]
	  , nick = this.parseNick(msg.prefix)
	  , command = msg.command;


	switch (true) {
		case (command === '353'): // NAMES
			this.parseNames(msg);
			break;
		case (command === '366'): // End of /NAMES
		case (command === '372'): // MOTD
			// console.log('<-- [' + command + '] ' + msg.arguments[1]);
			break;
		case (command === '376'): // End of MOTD, Ready to go
			var that = this;
			that.joinChannels.forEach(function(name){ // Join all the channels in the config
				that.channels[name] = new Channel(that, name);
			});

			this.plugins.forEach(function(plugin){
				if (typeof plugin.onReady === 'function') {
					plugin.onReady();
				}
			});
			break;
		case (command === 'JOIN'):
			var channel = msg.arguments[0].toLowerCase();
			console.log('<-- [' + command + '] ' + nick + ' joined ' + channel);
			this.channels[channel].userJoin(nick);

			this.plugins.forEach(function(plugin){
				if (typeof plugin.onJoin === 'function') {
					plugin.onJoin(channel, nick);
				}
			});
			break;
		case (command === 'KICK'):
			var channel = msg.arguments[0].toLowerCase()
			  , user = msg.arguments[1].toLowerCase();
			console.log('<-- [' + command + '] ' + nick + ' kicked ' + user + ' from ' + channel);
			this.channels[channel].userKick(user);
			
			this.plugins.forEach(function(plugin){
				if (typeof plugin.onKick === 'function') {
					plugin.onKick(channel, nick, user);
				}
			});
			break;
		case (command === 'MODE'):
			break;
		case (command === 'NICK'):
			var newNick = msg.arguments[0].toLowerCase();
			console.log('<-- [' + command + '] ' + nick + ' is now known as ' + newNick);
			for (channel in this.channels) {
				this.channels[channel].userNickChange(nick, newNick);
			}

			this.plugins.forEach(function(plugin){
				if (typeof plugin.onNick === 'function') {
					plugin.onNick(nick, newNick);
				}
			});
			break;
		case (command === 'PART'):
			var channel = msg.arguments[0].toLowerCase();
			console.log('<-- [' + command + '] ' + nick + ' left ' + channel);
			this.channels[channel].userPart(nick);

			this.plugins.forEach(function(plugin){
				if (typeof plugin.onPart === 'function') {
					plugin.onPart(channel, nick);
				}
			});

			break;
		case (command === 'PING'):
			console.log('<-- [' + command + '] ' + msg.arguments[0]);
			this.raw('PONG', msg.arguments);
			break;
		case (command === 'PRIVMSG'):
			var channel = msg.arguments[0]
			  , message = msg.arguments[1];
			console.log('<-- [' + command + '] <' + nick + '> ' + message);
			if (message.substring(0,1) == this.triggerPrefix) { // Check for a trigger event
				var trigger = message.split(' ')[0].substring(1, message.length);
				if (this.pluginTriggers[trigger]) {
					this.pluginTriggers[trigger].forEach(function(cb){
						cb.callback.call(cb.plugin, msg);
					});
				}
			}

			this.plugins.forEach(function(plugin){
				if (typeof plugin.onMessage === 'function') {
					plugin.onMessage(channel, nick, message);
				}
			});
			break;
		case (command === 'QUIT'):
			console.log('<-- [' + command + '] ' + nick);
			for (channel in this.channels) {
				this.channels[channel].userQuit(nick);
			}
			
			this.plugins.forEach(function(plugin){
				if (typeof plugin.onQuit === 'function') {
					plugin.onQuit(nick);
				}
			});
			break;
		default:
			console.log('<-- [' + command + '] (not implemented) <' + msg.prefix + '> ' + msg.arguments);
			//console.log(msg);
			break;
	}
};

irc.prototype.onEOF = function() {
	this.disconnect('EOF');
};

irc.prototype.onTimeout = function() {
	this.disconnect('Timeout');
};

irc.prototype.onClose = function() {
	this.disconnect('Close');
};

irc.prototype.raw = function(cmd) {
	if (this.conn.readyState !== 'open') {
		return this.disconnect("irc.raw: cannot send; ready state: " + this.conn.readyState);
	}

	var msg = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";
	console.log('--> [' + cmd + '] ' + msg.trim());
	this.conn.write(cmd + ' ' + msg, this.encoding);
};

irc.prototype.send = function(target, msg) {
	var message = Array.prototype.slice.call(arguments, 1).join(' ') + "\r\n";

	if (arguments.length > 1) {
		this.raw('PRIVMSG', target, ':' + message);
	}
};

irc.prototype.on = function(ev, f) {
	var that = this;
	return this.conn.on(ev, (function() {
		return function() {
			f.apply(that, arguments);
		};
	})());
};

irc.prototype.parseNames = function(msg) {
	var irc = this
	  , chan = msg.arguments[2]
	  , nickList = msg.arguments[3].replace(/\+|@/g, '').split(' ');

	nickList.forEach(function(nick){
		irc.channels[chan].userJoin(nick.toLowerCase());
	});
};

irc.prototype.parse = function(text) {
	if (typeof text  !== "string") {
		return false;
	}

	var tmp = text.split(" ");

	if (tmp.length < 2) {
		return false;
	}

	var prefix = null
	  , command = null
	  , lastarg = null
	  , args = [];

	for (var i = 0, j = tmp.length; i < j; i++) {
		if (i == 0 && tmp[i].indexOf(":") == 0) {
			prefix = tmp[0].substr(1);
		} else if (tmp[i] == "") {
			continue;
		} else if (!command && tmp[i].indexOf(":") != 0) {
			command = tmp[i].toUpperCase();
		} else if (tmp[i].indexOf(":") == 0) {
			tmp[i ] = tmp[ i].substr(1);
			tmp.splice(0, i);
			args.push(tmp.join(" "));
			lastarg = args.length - 1;
			break;
		} else {
			args.push(tmp[i]);
		}
	}

	return {
		prefix: prefix,
		command: command,
		arguments: args,
		lastarg: lastarg,
		orig: text
	};
};

irc.prototype.parseNick = function(mask) {
	if (!mask) {
		return;
	}

	var match = mask.match(/([^!]+)![^@]+@.+/);

	if (!match) {
		return;
	}

	return match[1].toLowerCase();
};
