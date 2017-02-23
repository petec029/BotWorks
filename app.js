

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
    function (session, args, next) {
        console.log(args);
        //session.dialogData.args = args;
        var accountType = builder.EntityRecognizer.findEntity(args.entities, 'accountType');
        var accountLevel = builder.EntityRecognizer.findEntity(args.entities, 'accountLevel');
        var typeOfPersonalAccount = builder.EntityRecognizer.findEntity(args.entities, 'typeOfPersonalAccount');
        var typeOfBusinessAccount = builder.EntityRecognizer.findEntity(args.entities, 'typeOfBusinessAccount');
        console.log('ENTITIES', accountType, accountLevel, typeOfPersonalAccount, typeOfBusinessAccount)l
        var account = {
          accountType: accountType ? accountType.entity : null,
          accountLevel: accountLevel ? accountLevel.entity : null,
          typeOfPersonalAccount : typeOfPersonalAccount  ? typeOfPersonalAccount.entity  : null,
          typeOfBusinessAccount: typeOfBusinessAccount? typeOfBusinessAccount.entity : null
        }
        session.dialogData.account = account;

        // Prompt for account type
        if (!account.accountType) {
          builder.Prompts.text(session, 'What type of account do you want to set up?');
        } else {
          next();
        }
    },
    function (session, results, next) {
        console.log('second block')
    	  var account = session.dialogData.account
		    if (results.response) {
			      console.log('RESPONSE', results)
			      account.accountType = results.response
        }

        // Prompt for account level
        if (!account.accountLevel) {
          builder.Prompts.text(session, 'What level account would you like? Basic or Premium');
        } else {
          next();
        }
    },


/*
        var accountTypes = ["Business","Personal"];

        console.log('accountType',accountType);
        if (!accountType) {
//            builder.Prompts.text(session, "What type of account do you want to set up? Business or Personal");
            builder.Prompts.choice(session, "What type of account do you want to set up?", accountTypes);
        } else {
//          session.dialogData.accountType.entity = accountType;
            session.dialogData.accountType = accountType;
            next();
//            next({ response: accountType.entity });
        }

    },
    function (session, results, next) {
        //if (results.response) {
        //  session.dialogData.accountType = results.response;
        //}
        var accountLevel = builder.EntityRecognizer.findEntity(session.dialogData.args.entities, 'accountLevel');
        console.log('accountType',accountLevel);
        if (!accountLevel) {
//            builder.Prompts.text(session, "What account level do you want to set up? Basic or Premium");
            builder.Prompts.choice(session, "What account level do you want to set up?", ["Basic","Premium"]);
        } else {
            //session.dialogData.accountLevel.entity = accountLevel;
            session.dialogData.accountLevel.entity = accountLevel;
            next();
            //next({ response: accountLevel.entity });
        }
    },
    */
    function (session, results) {
        console.log('reply')
        var account = session.dialogData.account
        if (results.response) {
            console.log('RESPONSE', results)
            account.accountLevel = results.response

          //session.dialogData.accountLevel = results.response;
          // ... save task
          //session.send("Intent: new account, accountType: '%s', accountLevel: '%s'", accountType, accountLevel);
//            session.send("Intent: 'new account'");
          //session.send("Intent: 'new account'\n\nAccountType: '%s'\n\nAccountLevel: '%s'",session.dialogData.accountType.entity ,session.dialogData.accountLevel.entity);
//            session.send("AccountType: '%s'", session.dialogData.accountType);
//            session.send("AccountLevel: '%s'", results.response);
//            session.send("AccountType: '%s'", results.response);
//            session.send("AccountLevel: '%s'", results.response);
        }
        //else {
        //    session.send("Ok Intent: 'new account'\n\nAccountType: '%s'\n\nAccountLevel: '%s'",session.dialogData.accountType.entity ,session.dialogData.accountLevel.entity);
        //}
        session.send("Intent: 'new account'\n\nAccountType: '%s'\n\nAccountLevel: '%s'",account.accountType, account.accountLevel);
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
