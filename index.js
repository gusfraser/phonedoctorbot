'use strict'

const BootBot = require('bootbot');

const bot = new BootBot({
    accessToken: process.env.FB_PAGE_ACCESS_TOKEN,
    verifyToken: 'my_voice_is_my_password_verify_me',
    appSecret: process.env.FB_APP_SECRET
});

bot.on('message', (payload, chat) => {
    const text = payload.message.text;
    console.log('We heard you: ' + text);
  });

  bot.setGreetingText('Hello! We are listening while we test our new bot! We are open 08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat, but our helpful bot is here 24/7!');
  
  bot.setGetStartedButton((payload, chat) => {
    chat.getUserProfile().then((user) => {
        chat.say('Hello ' + user.first_name, { typing: true }).then(() => {
                chat.say({
                    text: 'What can we help you with today?',
                    quickReplies: ['Screen replacement', 'Existing order', 'Other'],
                    typing: true
                });
            });        
        });
  });

bot.hear(['human','help'], (payload, chat) => {

    chat.say('One of our friendly humans will get back to you as soon as possible within our working hours (08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat) \r\n Thank you for your patience, you can also try calling us on 01534 811999');

}); 


bot.hear(['Screen replacement'], (payload, chat) => {
  
   
    chat.conversation(convo => {
         // method sig: 
        // ask(question, answer, callbacks, options) {
        //  if (!question || !answer || typeof answer !== 'function') {
        //  return console.error(`You need to specify a question and answer to ask`);
        convo.ask(
            {
            text: 'Sorry to hear you have a problem with your screen. We can fix that for you. What kind of device do you have?',
            quickReplies: [ 'iPhone', 'iPad', 'Samsung', 'Other' ]
            }
            ,        
            (payload, convo, data) => {
            const text = payload.message.text;
            convo.set('DeviceType', text);
            if(text == 'iPhone')
            {
                askIphoneModel(convo);
            }
            else if(text == 'iPad')
            {
                askIpadModel(convo);
            }
            else if(text == 'Other')
            {
                convo.say('We can fix most phones, please can you let us know what model you have and any further details about the issue? We will get back to you ASAP');
            }           
        }
       
    );
    
         

    });

	/* chat.say({
		text: 'Sorry to hear you have a problem with your screen. We can fix that for you. What kind of device to you have?',
		buttons: [
            { type: 'postback', title: 'iPhone or iPad', payload: 'APPLESCREEN' },
            { type: 'postback', title: 'Samsung Phone', payload: 'SAMSUNGSCREEN' },
            { type: 'postback', title: 'Other', payload: 'OTHERSCREEN' }
		]
	}); */
});



bot.hear(['APPLESCREEN'], (payload, chat) => {
    chat.say({
		text: 'Is it an iPad or iPhone?',
		buttons: [
            { type: 'postback', title: 'iPhone', payload: 'IPHONESCREEN' },
            { type: 'postback', title: 'Samsung', payload: 'IPADCREEN' }
		]
	});
});

bot.hear(['IPHONESCREEN'], (payload, chat) => {
    // Send a text message with buttons
    // Send a text message with buttons
	chat.say({
        text: 'To help you further we need to identify what model of iPhone you have.',
        quickReplies: ['iPhone X', 'iPhone 8', 'iPhone 7', 'iPhone','Don\'t know']
    });
});

bot.hear(['IPHONE6SCREEN','IPHONE7SCREEN','IPHONEXSCREEN'], (payload, chat) => {
	chat.say({
		text: 'The price for fixing your iPhone is (TBC). Our priority service can have this fixed within TBC hours'
    });
});


bot.hear([' '], (payload, chat) => {
	chat.say({
		text: 'Ok let\'s identify what model you have. [Pics coming soon...]'
    });
}); 


bot.on('hello', (payload, chat) => {
  
    console.log("hello");
    convo.ask('Hello! We are listening while we test our new bot! We are open 08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat, but our helpful bot is here 24/7! \r\nWhat\'s your name?', (payload, convo, data) => {
      const text = payload.message.text;
      convo.set('name', text);
      convo.say('Hi ${text}').then(() => askWhatHelp(convo));
    });

});

const mainIssue = (convo) => {
  /*  bot.getUserProfile().then((user) => {
        bot.say('Hello, ${user.first_name}! We are open 08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat, but our helpful bot is here 24/7!');
        bot.say('If you want to speak to a human at any time please just write "human"');
        bot.say('Please excuse us while we test out bot out. We are still here and listening to you :-)');
    });
    */
    console.log("mainIssue");
    convo.ask('Hello! We are listening while we test our new bot! We are open 08:30 - 17:30 Mon - Fri, 09:00 - 17:00 Sat, but our helpful bot is here 24/7! \r\nWhat\'s your name?', (payload, convo, data) => {
      const text = payload.message.text;
      convo.set('name', text);
      convo.say('Hi ${text}').then(() => askWhatHelp(convo));
    });

  };

const askWhatHelp = (convo) => {
    convo.ask((convo) => {
      const buttons = [
        { type: 'postback', title: 'Screen Damage', payload: 'SCREEN' },
        { type: 'postback', title: 'Existing Order', payload: 'EXISTINGORDER' },
        { type: 'postback', title: 'Other', payload: 'OTHER' }
    ];
    convo.sendButtonTemplate('What can we help you with today?', buttons);
    }, (payload, convo, data) => {
      const text = payload.message.text;
      convo.set('whathelp', text);
      convo.say('Thank you').then(() => ask(convo));
    }, [         
      {
        event: 'postback:SCREEN',
        callback: (payload, convo) => {
          convo.say('We can repair most screens, we just need to find out a bit more about your model').then(() => askModel(convo));
        }
      },
      {
        event: 'postback:EXISTINGORDER',
        callback: (payload, convo) => {
          convo.say('Thank you').then(() => askOrderNumber(convo));
        }
      },
      {
        event: 'quick_reply',
        callback: () => {}
      },
      {
        pattern: ['yes', /yea(h)?/i, 'yup'],
        callback: () => {
          convo.say('You said YES!').then(() => askAge(convo));
        }
      }
    ]);
  };

  const askIphoneModel = (convo) => {
    convo.ask({
            text: 'To help you further we need to identify what model of iPhone you have.',
            quickReplies: ['iPhone X', 'iPhone 8', 'iPhone 7', 'iPhone','Don\'t know']
        }
        ,
        (payload, convo, data) => {
            const text = payload.message.text;
            convo.say("That will cost TBC to replace an " + text + " screen. We can have this done for you with our express service in 4 working hours, or a typical 2 day turnaround.")
            Console.log("askiPhoneModel:" + text);
        }
    )
    };

    const askIpadModel = (convo) => {
        convo.ask({
                text: 'To help you further we need to identify what model of iPhone you have.',
                quickReplies: ['iPad Mini', 'iPad', 'iPad Pro', 'Don\'t know']
            }
            ,
            (payload, convo, data) => {
                const text = payload.message.text;
                convo.say("That will cost TBC to replace an " + text + " screen. We can have this done for you with our express service in 4 working hours, or a typical 2 day turnaround.")     
                Console.log("askiPadModel:" + text);
            }
        )
        };


  const askModel = (convo) => {
    convo.ask((convo) => {
      const buttons2 = [
        { type: 'postback', title: 'iPhone', payload: 'IPHONE' },
        { type: 'postback', title: 'iPad', payload: 'IPAD' },
        { type: 'postback', title: 'Samsung', payload: 'SAMSUNG' },
        { type: 'postback', title: 'Other', payload: 'OTHER' }
    ];
    convo.sendButtonTemplate('What kind of device do you have?', buttons2);
    }, (payload, convo, data) => {
      const text = payload.message.text;
      convo.set('whatkindofdevice', text);
      convo.ask(convo);
    }, [            
        {
          event: 'postback:IPHONE',
          callback: (payload, convo) => {
            convo.say('Thank you. Now let\'s find out exactly what model').then(() => askIphoneModel(convo));
          }
        },
        {
            event: 'postback:IPAD',
            callback: (payload, convo) => {
              convo.say('Thank you. Now let\'s find out exactly what model').then(() => askIpadModel(convo));
            }
          },
          {
            event: 'postback:SAMSUNG',
            callback: (payload, convo) => {
              convo.say('Thank you. Now let\'s find out exactly what model').then(() => askSamsungModel(convo));
            }
          },
        {
          event: 'postback:OTHER',
          callback: (payload, convo) => {
            convo.say('Thank you. We will get back to you ASAP, please provide further details.').then(() => askOrderNumber(convo));
          }
        },

        {
          event: 'quick_reply',
          callback: () => {}
        }
        
      ]);
    };    

bot.start();


