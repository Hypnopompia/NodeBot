/**
 * Map
 *
 * @author		ahunter
 * @website		
 * @copyright	ahunter
 */
var sys = require('util');

Plugin = exports.Plugin = function(irc) {
	this.name = 'map';
	this.irc = irc;

	this.irc.addTrigger(this, 'map', this.map);
	this.irc.addTrigger(this, 'start', this.start);
	this.irc.addTrigger(this, 'north', this.north);
	this.irc.addTrigger(this, 'south', this.south);
	this.irc.addTrigger(this, 'east', this.east);
	this.irc.addTrigger(this, 'west', this.west);

};

Plugin.prototype.start = function(msg){
	var that = this;
	this.width = Math.floor(Math.random()*500);
	this.height = this.width;
	this.userData = {};
	
	var channelName = msg.arguments[0].toLowerCase()
	, channel = this.irc.channels[channelName] || false;
	
	var userList = channel.users;
	userList.forEach(function(value) {
		that.userData[value] = {X:Math.floor(Math.random() * that.width),Y:Math.floor(Math.random() * that.height)};
		
  });
	channel.send('Map generated');
	channel.send('Width: ' + this.width + ' Height: '+ this.height);
}

Plugin.prototype.north = function(msg){
	var channelName = msg.arguments[0].toLowerCase()
	, channel = this.irc.channels[channelName] || false;
	
	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2]);

	if(this.userData && this.userData[nick]){
		if(this.userData[nick].Y+1 > this.height){
			channel.send(nick+' You ran into the wall and your face is now uglier');
			channel.send(nick+' You are still at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		} else {
			this.userData[nick].Y = this.userData[nick].Y+1;
			channel.send(nick+' You are now at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		}
	} else {
		channel.send(nick+' You will have to wait until the next game starts');
	}
}

Plugin.prototype.south = function(msg){
	
	var channelName = msg.arguments[0].toLowerCase()
	, channel = this.irc.channels[channelName] || false;
	
	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2]);

	if(this.userData && this.userData[nick]){
		if(this.userData[nick].Y-1 < (0-this.height)){
			channel.send(nick+' You ran into the wall and your face is now uglier');
			channel.send(nick+' You are still at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		} else {
			this.userData[nick].Y = this.userData[nick].Y-1;
			channel.send(nick+' You are now at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		}
	} else {
		channel.send(nick+' You will have to wait until the next game starts');
	}
}

Plugin.prototype.east = function(msg){
	
	var channelName = msg.arguments[0].toLowerCase()
	, channel = this.irc.channels[channelName] || false;
	
	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2]);
		
	if(this.userData && this.userData[nick]){
		if(this.userData[nick].X+1 > this.width){
			channel.send(nick+' You ran into the wall and your face is now uglier');
			channel.send(nick+' You are still at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		} else {
			this.userData[nick].X = this.userData[nick].X+1;
			channel.send(nick+' You are now at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		}
	} else {
		channel.send(nick+' You will have to wait until the next game starts');
	}
}

Plugin.prototype.west = function(msg){
	
	var channelName = msg.arguments[0].toLowerCase()
	, channel = this.irc.channels[channelName] || false;
	
	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2]);

	if(this.userData && this.userData[nick]){
		if(this.userData[nick].X-1 < (0-this.width)){
			channel.send(nick+' You ran into the wall and your face is now uglier');
			channel.send(nick+' You are still at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		} else {
			this.userData[nick].X = this.userData[nick].X-1;
			channel.send(nick+' You are now at: '+ this.userData[nick].X + ','+ this.userData[nick].Y);
		}
	} else {
		channel.send(nick+' You will have to wait until the next game starts');
	}
}

Plugin.prototype.map = function(msg) {
	var channelName = msg.arguments[0].toLowerCase()
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}
	
	var nick = this.irc.parseNick(msg.prefix); // Nick of the user who triggered this callback
	
	if(this.userData && this.userData[nick]){
		channel.send(nick+ ' Your starting location is: ' +this.userData[nick].X + ','+ this.userData[nick].Y);
	} else {
		channel.send(nick+' You will have to wait until the next game starts');
	}
};

