/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};
//need to store the message objects
var storage = { results: [{ username: 'Jono', text: 'Do my bidding!', roomname: 'lobby', 'message_id': 0 }] };
var id = 0;

var requestHandler = function (request, response) {
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  if (request.method === 'GET' && request.url === '/classes/messages') {
    // The outgoing status.
    var statusCode = 200;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(storage));

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    var statusCode = 201;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);

    request.on('data', (chunk) => {
      storage.results.unshift(JSON.parse(chunk));
      // Check storage for size?
      // Give each message an ID.
      // add an ID property to the first message in the results array
      id++;
      storage.results[0]['message_id'] = id;
      response.end(JSON.stringify(JSON.parse(chunk)));
    });
  } else if (request.method === 'OPTIONS' && request.url === '/classes/messages') {
    var statusCode = 202;

    response.writeHead(statusCode, headers);
    response.end();
  } else {
    // The outgoing status.
    var statusCode = 404;

    response.writeHead(statusCode, headers);
    response.end('Can\'t be reached');

  }
};

exports.requestHandler = requestHandler;