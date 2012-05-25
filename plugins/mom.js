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
	this.irc.addTrigger(this, 'momkov', this.momkov);
	
	this.jokes = [
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
};

Plugin.prototype.mom = function(msg) {
	var channelName = msg.arguments[0].toLowerCase()
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}

	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2])
	  , jokes = this.jokes;
	
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

Plugin.prototype.momkov = function(msg) {
	var channelName = msg.arguments[0].toLowerCase()
	  , channel = this.irc.channels[channelName] || false;

	if (!channel) {
		return;
	}

	var userList = channel.users // List of all the users in the current channel
	  , nick = this.irc.parseNick(msg.prefix) // Nick of the user who triggered this callback
	  , message = msg.arguments[1]
	  , params = message.split(' ')
	  , target = params.length >= 2 ? params[1].toLowerCase() : false
	  , num = parseInt(params[2])
	  , jokes = this.jokes;

	if(target && jokes.length > 0){
		if (this.irc.botNick.toLowerCase() == target) {
			channel.send(nick + ", I'm not going to insult my own mother.");
		} else if (userList.indexOf(target) > -1) {
			if (num > 0 && num <= jokes.length) {
				num = num - 1;
			} else {
				num = Math.floor(Math.random()*(jokes.length - 1));
			}
			channel.send(target + ', ' + this.getMarkov());
		} else {
			channel.send(nick + ', ' + target + " isn't here. That's a low blow...");
		}
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

Plugin.prototype.getMarkov = function() {
	var look = 4
	  , length = 1000
	  , text = this.jokes.join("\n")
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

