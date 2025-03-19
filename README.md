# plumb bob

A plumb bob is a weighted object connected to a string, typically used in building construction to establish a vertical line. This app is a simple node express app that responds to HTTP requests.
Same thing, right?

Well, both are simple tools used to help keep things aligned. This app can be used to establish a baseline understanding of TwiML behavior, and align our troubleshooting methods with actual call flows.  

# Installation

Install Node.js - https://nodejs.org/en/download/


Install dependencies in package.json
```bash
npm install
```
Or, individually as needed:

nodemon - helps with rapid prototyping by automatically restarting the node application when file changes in the directory are detected.
https://www.npmjs.com/package/nodemon
```bash
npm install -g nodemon
```

express - minimalism web framework for node
https://www.npmjs.com/package/express
```bash
npm install express
```

twilio - lets you write Node.js code to return TwiML and make HTTP requests to the Twilio API.
https://www.twilio.com/docs/libraries/node
```bash
npm install twilio
```

body-parser - helps parse incoming request bodies
https://www.npmjs.com/package/body-parser
```bash
npm install body-parser
```

# ngrok
Applications run on localhost cannot be reached by Twilio. The quickest way to make your app available over the internet is to use ngrok.
Twilions get free ngrok accounts, so please remember to connect to your account and set up custom subdomain!
https://ngrok.com/download
https://dashboard.ngrok.com/endpoints/domains
https://ngrok.com/docs#http-subdomain

# Usage

Once dependencies are installed, run your app with one command:
```bash
node voice-test-app.js
```

Or, using nodemon (recommended)
```bash
nodemon voice-test-app.js
```

Then, open your ngrok tunnel:
```bash
ngrok http 3000 --subdomain "yourDomain"
```

Finally, use your new app in a Twilio Programmable Voice call!

Open the ngrok debugger to watch requests flow in!
http://127.0.0.1:4040 
