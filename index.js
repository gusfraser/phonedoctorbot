'use strict'

const BootBot = require('bootbot');

const bot = new BootBot({
    accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
    verifyToken: 'my_voice_is_my_password_verify_me',
    appSecret: process.env.FB_APP_SECRET
});


bot.hear(['human', 'Human', 'HUMAN'], (payload, chat) => {

    chat.say({
        text: 'We will get back to you as soon as possible within our working hours (08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat) \r\n Thank you for your patience, you can also try calling us on 01534 811999'
    });

});

bot.hear(['SCREEN'], (payload, chat) => {
	// Send a text message with buttons
	chat.say({
		text: 'Sorry to hear you have a problem with your screen. What kind of device to you have?',
		buttons: [
            { type: 'postback', title: 'iPhone', payload: 'IPHONESCREEN' },
            { type: 'postback', title: 'iPad', payload: 'IPADSCREEN' },
            { type: 'postback', title: 'Samsung', payload: 'SAMSUNGSCREEN' },
            { type: 'postback', title: 'Other', payload: 'OTHERSCREEN' }
		]
	});
});

bot.hear(['IPHONESCREEN'], (payload, chat) => {
    // Send a text message with buttons
    // Send a text message with buttons
	chat.say({
		text: 'To help you further we need to identify what model of iPhone you have.',
		buttons: [
            { type: 'postback', title: 'iPhone 6', payload: 'IPHONE6SCREEN' },
            { type: 'postback', title: 'iPhone 7', payload: 'IPHONE7SCREEN' },
            { type: 'postback', title: 'iPhone X', payload: 'IPHONEXSCREEN' },
            { type: 'postback', title: 'Don\'t know', payload: 'IPHONESCREENHELP' }
		]
    });
});

bot.hear(['IPHONE6SCREEN','IPHONE7SCREEN','IPHONEXSCREEN'], (payload, chat) => {
    // Send a text message with buttons
    // Send a text message with buttons
	chat.say({
		text: 'The price for fixing your iPhone is (TBC). Our priority service can have this fixed within TBC hours'
    });
});


bot.hear(['IPHONESCREENHELP'], (payload, chat) => {
    // Send a text message with buttons
    // Send a text message with buttons
	chat.say({
		text: 'Ok let\'s identify what model you have. [Pics coming soon...]'
    });
}); 


bot.start();

bot.getUserProfile().then((user) => {
    bot.say('Hello, ${user.first_name}! We are open 08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat, but our helpful bot is here 24/7!');
    bot.say('If you want to speak to a human at any time please just write "human"');
    bot.say('Please excuse us while we test out bot out. We are still here and listening to you :-)');
});

// Send a button template
bot.say({
	text: 'What can we help you with today?',
	buttons: [
		{ type: 'postback', title: 'Screen Damage', payload: 'SCREEN' },
        { type: 'postback', title: 'Existing Order', payload: 'EXISTINGORDER' },
        { type: 'postback', title: 'Other', payload: 'OTHER' }
	]
});
