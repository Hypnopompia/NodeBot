var irc = require('./irc');
var config = {
	host: 'irc.freenode.net'
	,botNick: 'botnickname'
	,channels: ['#node']
	,plugins: ['poke', 'mom']
//	, nickServPass: ''
};
var client = new irc.irc(config);
client.connect();

