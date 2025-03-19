const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const app = express();

const urlencoded = require('body-parser').urlencoded;
app.use(urlencoded({ extended: false }));

//Enter Twilio Account SID and Auth Token
const accountSid = 'ACxxx';
const authToken = 'abc123';
const client = require('twilio')(accountSid, authToken);


// Debugger Webhook //

app.post('/debugger', (request, response) => {
    console.log(request.body.Payload);
    response.sendStatus(200);
});

// END Debugger Webhook //



/* TwiML */

//Say - https://www.twilio.com/docs/voice/twiml/say
app.post('/say-fr', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say({
        voice: 'alice',
        language: 'fr-FR'
    }, 'Chapeau!');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/say-sv', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say({
        language: 'sv-SE'
    }, 'Hej!');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.get('/say-basic', (request, response) => {
    const twiml = new VoiceResponse();
    //twiml.say('Hello. This is a connectivity test. Thank you for your cooperation. The call will be disconnected after this message. We appreciate your business. Thank you. Bye for now.');
    twiml.say('Hello. This is a connectivity test')
    twiml.pause({
        length: 10
    });
    twiml.say("Bye for now.")
    response.type('text/xml');
    response.send(twiml.toString());
});



//Gather - https://www.twilio.com/docs/voice/twiml/gather
app.post('/gather-dtmf', (request, response) => {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        action: '/gather-dtmf-action',
        method: 'POST',
        input: 'dtmf'
    });
    gather.say('Please enter a number to see what happens.');
    twiml.say('We didn\'t receive any input. Goodbye!');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/gather-speech', (request, response) => {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        action: '/gather-action',
        method: 'POST',
        input: 'speech'
    });
    gather.say('Please say a phrase to see what happens.');
    twiml.say('We didn\'t hear any input. Goodbye!');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/gather-both', (request, response) => {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        action: '/gather-action',
        method: 'POST',
        input: 'dtmf speech'
    });
    gather.say('Please say a phrase to see what happens.');
    twiml.say('We didn\'t hear any input. Goodbye!');
    response.type('text/xml');
    response.send(twiml.toString());
});



//Dial - https://www.twilio.com/docs/voice/twiml/dial
app.post('/simple-dial', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.dial('+17195676742'); // Speaking Clock
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/dial-record', (request, response) => {
    const twiml = new VoiceResponse();
    const dial = twiml.dial({
        record: 'record-from-answer-dual',
        recordingStatusCallback: '/recording-status-callback'
    });
    dial.number('+17195676742'); // Speaking Clock
    response.type('text/xml');
    response.send(twiml.toString());
});

//Dial Number - https://www.twilio.com/docs/voice/twiml/number
app.post('/dial-number', (request, response) => {
    const twiml = new VoiceResponse();
    const dial = twiml.dial({
        action:'/dial-ation'
    });
    dial.number('+17195676742'); // Speaking Clock
    response.type('text/xml');
    response.send(twiml.toString());
});

//Dial Queue - https://www.twilio.com/docs/voice/twiml/queue
app.post('/dial-queue', (request, response) => {
    const twiml = new VoiceResponse();
    const dial = response.dial();
    dial.queue({
        url: '/queue-screening-url'
    }, 'Demo Queue');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/queue-screening-url', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say('You will now be connected to an agent.')
    response.type('text/xml');
    response.send(twiml.toString());
});

//Dial Sip - https://www.twilio.com/docs/voice/twiml/sip
app.post('/dial-sip', (request, response) => {
    const twiml = new VoiceResponse();
    const dial = response.dial({
        hangupOnStar: true,
        callerId: 'twilio',
        method: 'POST',
        action: '/dial-action'
    });
    dial.sip({
        method: 'POST',
        url: '/sip-screening-url'
    }, 'sip:kate@example.com?x-customheader=foo');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/sip-screening-url', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say('You will now be connected.')
    response.type('text/xml');
    response.send(twiml.toString());
});


//Redirect - https://www.twilio.com/docs/voice/twiml/redirect //
app.post('/say-redirect0', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say({
        voice: 'Polly.Matthew'
    }, 'Hello! This is a simple say verb. See you later!');
    twiml.redirect('/say-redirect1');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/say-redirect1', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say({
        voice: 'Polly.Matthew'
    }, 'Hi! This is another say verb, and the next stop on the journey.');
    twiml.redirect('/say-redirect2');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/say-redirect2', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.say({
        voice: 'Polly.Matthew'
    }, 'Hi! This is yet another say verb, and another next stop on the voyage.');
    twiml.redirect('/play-redirect3');
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/play-redirect3', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.play('https://play-verb-tests-5011.twil.io/goal.mp3')
    twiml.redirect('/say-redirect0');
    response.type('text/xml');
    response.send(twiml.toString());
});



//Enqueue - https://www.twilio.com/docs/voice/twiml/enqueue
app.post('/enqueue', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.enqueue({
        waitUrl: '/wait-url-1'
    }, 'Demo Queue');
    response.type('text/xml');
    response.send(twiml.toString());
});



//Play - https://www.twilio.com/docs/voice/twiml/play
app.post('/wait-url-1', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.play('http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3');
    response.type('text/xml');
    response.send(twiml.toString());
});



//Hangup - https://www.twilio.com/docs/voice/twiml/hangup
app.post('/hangup', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.hangup();
    response.type('text/xml');
    response.send(twiml.toString());
});



//Reject - https://www.twilio.com/docs/voice/twiml/reject
app.post('/reject-busy', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.reject({
        reason: 'busy'
    });
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/reject-rejected', (request, response) => {
    const twiml = new VoiceResponse();
    twiml.reject({
        reason: 'rejected'
    });
    response.type('text/xml');
    response.send(twiml.toString());
});
/* End TwiML */



/* Callbacks */

//Status Callbacks
app.post('/status', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/inbound-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/number-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/conference-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/outbound-api-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/participant-api-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});

app.post('/pay-status-callback', (request, response) => {
    console.log(request.body);
    response.sendStatus(204);
});



//Action Callbacks
app.post('/record-action', (request, response) => {
    const twiml = new VoiceResponse();
    const rdur = request.body.RecordingDuration;
    twiml.say('Call duration was ' + rdur + ' seconds.')
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/dial-action', (request, response) => {
    const twiml = new VoiceResponse();
    const dur = request.body.Duration;
    twiml.say('Call duration was ' + dur + ' seconds.')
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/gather-action', (request, response) => {
    const twiml = new VoiceResponse();
    try {
        const d = request.body.Digits;
        twiml.say('Digits received. ' + d);
    }
    catch(err) {
        console.log('No Digits in request.')
    }
    try {
        const sr = request.body.SpeechResult;
        twiml.say('Speech result is ' + sr);
    }
    catch(err) {
        console.log('No Speech Result in request.')
    }
    response.type('text/xml');
    response.send(twiml.toString());
});

app.post('/gather-dtmf-action-fwd', (request, response) => {
    const twiml = new VoiceResponse();
    const d = request.body.Digits;
    if (d == '4') {
        twiml.say('You pressed' + d + 'Transferring the call.');
        twiml.dial('+17195676742');
      } else {
        twiml.say('Digits recieved. ' + d);
      }
    response.type('text/xml');
    response.send(twiml.toString());
});



//Recordings Status Callbacks
app.post('/recording-status-callback', (request, response) => {
    console.log(request.body.Payload);
    response.sendStatus(200);
});


app.post('/recording-download-delete', (request, response) => {
    const rec_status = request.body.RecordingStatus
    const rec_sid = request.body.RecordingSid
    const rec_url = `${request.body.RecordingUrl}.wav`
    const rec_filename = `recordings/${request.body.RecordingSid}.wav`
    
    async function deleteRecording(rsid) {
        await client.recordings(rsid).remove();
      }

    if (!rec_url) {
        return response.status(400).json({ error: 'fileUrl and filename are required' });
      }

    if(rec_status == 'completed') { 
        var https = require('https');
        var fs = require('fs');

        var file = fs.createWriteStream(rec_filename);
        var complete_url = `https://${accountSid}:${authToken}@api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${rec_sid}.wav`
        var req = https.get(complete_url, function(res) {
            res.pipe(file);
            deleteRecording(rec_sid);
            return response.status(200)
        });
    }
    return response.status(500).json({error: "an error has occured..."})
});



//Transcriptions Status Callbacks
app.post('/transcription-status-callback', (request, response) => {
    console.log(request.body.Payload);
    response.sendStatus(200);
});

app.post('/vb-transcription-callback', (request, response) => {
    console.log(request.body.Payload);
    response.sendStatus(200);
});

/* End Callbacks */

/* HTTP Stuff */

// HTTP 302 Redirect
app.get('/redirect302', (request, response) => {
    var id = request.query;
    console.log(id);
    response.redirect('/say-basic?')
});

app.post('/http500', (request, response) => {
    response.status(500).send('Something broken!')
});

app.post('/http404', (request, response) => {
    response.status(404).send('Something is missing!')
});

/* End HTTP Stuff */


// Create an HTTP server and listen for requests on port 3000
app.listen(3000, () => {
  console.log(
    'Now listening on port 3000. ' +
    'Be sure to restart when you make code changes! ' +
    'Or, just use nodemon - https://www.npmjs.com/package/nodemon'
  );
}); 
