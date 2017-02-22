

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

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9eb8032f-bf57-4d9e-99ec-6ea77dfd9033?subscription-key=63b95557298e43db812f2708f818030a&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.matches('new account', [
    //var accountType;
    //var accountLevel;
    //var typeOfPersonalAccount;
    //var typeOfBusinessAccount;
    //var args1;

    function (session, args, next) {
        //args1 = args;
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'accountType');
        var accountLevel = builder.EntityRecognizer.findEntity(args.entities, 'accountLevel');
        if (!accountType) {
            builder.Prompts.text(session, "What type of account do you want to set up? Business or Personal");
        } else {
            next({ response: accountType.entity });
//            next();
        }
    },
    /*
    function (session, results, next) {
        //accountLevel = builder.EntityRecognizer.findEntity(args1.entities, 'accountLevel');
        if (!accountLevel) {
            builder.Prompts.text(session, "What account level do you want to set up? Basic or Premium");
        } else {
            next({ response: accountLevel.entity });
        }
    },
    */
    function (session, results) {
        if (results.response) {
            // ... save task
            //session.send("Intent: new account, accountType: '%s', accountLevel: '%s'", accountType, accountLevel);
            session.send("Intent: 'new account' \nAccountType: '%s'", results.response);
        } else {
            session.send("Ok");
        }
    }
]);

intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));


// Add intent handlers
//dialog.matches('builtin.intent.alarm.set_alarm', builder.DialogAction.send('Creating Alarm'));
//dialog.matches('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'));
//dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

// Create bot dialogs
//bot.dialog('/', function (session) {
//    session.send("Hello RightAnswers");
//});



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
