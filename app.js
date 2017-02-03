// Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function()
{
    console.log('%s listening to %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));


// Create chat bot
var connector = new builder.ChatConnector
({ appId: '0dc7da38-9c10-4348-b404-0a209b0fe0f6', appPassword: 'iocgVXAm0ZzfPVFBbiH8oyb' });
var bot = new builder.UniversalBot(connector);
server.post('/API/Messages', connector.listen());

// Create bot dialogs
bot.dialog('/', function (session) {
    session.send("Hello RightAnswers");
});
