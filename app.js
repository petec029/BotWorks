
// Original hello world program
var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function()
{
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat bot
var connector = new builder.ChatConnector
({ appId: '0dc7da38-9c10-4348-b404-0a209b0fe0f6', appPassword: 'iocgVXAm0ZzfPVFBbiH8oyb' });
var bot = new builder.UniversalBot(connector);
server.post('botframework/receive', connector.listen());
//server.post('/API/Messages', connector.listen());

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));


// Create bot dialogs
bot.dialog('/', function (session) {
    session.send("Hello RightAnswers");
});



/*
var Botkit = require('botkit');
var controller = Botkit.botframeworkbot({
});

var bot = controller.spawn({
        appId: '0dc7da38-9c10-4348-b404-0a209b0fe0f6',
        appPassword: 'iocgVXAm0ZzfPVFBbiH8oyb'
});


// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(3000,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function() {
      console.log('This bot is online!!!');
  });
});

// user said hello
controller.hears(['hello'], 'message_received', function(bot, message) {

    bot.reply(message, 'Hey there.');

});

controller.hears(['cookies'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});
*/


