/**
 * Mom
 *
 * @author		bhosie
 * @website		
 * @copyright	bhosie
 */
var sys = require('util');

Plugin = exports.Plugin = function(irc) {
	this.name = 'mom';
	this.irc = irc;

	this.irc.addTrigger(this, 'mom', this.mom);
};

Plugin.prototype.mom = function(msg) {
	var channelName = msg.arguments[0]
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}

	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length > 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2])
	  , jokes = [
		"your mom is so fat the recursive function calculating her mass causes a stack overflow",
		"Your mom is so fat she's on both sides of the family.",
		"Your mom is like a doorknob.... everyone gets a turn!",
		"Your mom is like a race car driver, she burns 50 rubbers a day.",
		"Yo mom is so stupid she thought a quarterback was a refund.",
		"Yo mom is so fat, she was floating in the ocean and Spain claimed her for the new world!",
		"Yo mom is so fat she can't even fit in the chat room.",
		"Your mom is like a hardware store, 5 cents a screw",
		"Yo mom is so poor when I rang the doorbell she stuck her head out the window and yelled ding dong.",
		"Yo mom is so poor, she has to hang toilet paper out to dry.",
		"Your mom is so fat, when she turns around they throw her a welcome back party.",
		"Your mom is so fat, people jog around her for exercise.",
		"Yo mom is so fat, her nickname is 'DAMN'",
		"Hindus don't talk about your mom because cows are sacred",
		"Hindus take one look at your mom and get Sikh",
		"Yo momma so ugly just after she was born, her mother said, \"What a treasure!\" and her father said, \"Yea, let's go bury it!\"",
		"Yo momma so ugly she gets 364 extra days to dress up for Halloween.",
		"Yo momma is like a vacuum cleaner.  She sucks, blows, and gets laid in the closet.",
	];
	
	if(target && jokes.length > 0){
		if (this.irc.botNick.toLowerCase() == target) {
			channel.send(nick + ", I'm not going to insult my own mother.");
		} else if (userList.indexOf(target) > -1) {
			if (num > 0 && num <= jokes.length) {
				num = num - 1;
			} else {
				num = Math.floor(Math.random()*(jokes.length - 1));
			}
			channel.send(target + ', ' + jokes[num]);
		} else {
			channel.send(nick + ', ' + target + " isn't here. That's a low blow...");
		}
	}	
	
};
