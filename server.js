const http = require('http');
const app = require('./app'); //Pass app to create server and the Express app qualifies as a request handler

const port = process.env.port || 3000; // access node.js environment variable

const server = http.createServer(app); 
//create a server and store in a function
//To create the function needs to pass a listener, 
//a function executed each time we got a new request and is responsible for returning the response

server.listen(port);
//event listener