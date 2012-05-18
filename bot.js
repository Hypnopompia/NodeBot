var irc = require('./irc');
var config = {
	host: 'irc.freenode.net',
	channels: ['#node'],
	plugins: ['poke', 'mom']
};
var client = new irc.irc(config);
client.connect();

