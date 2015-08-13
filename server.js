var express = require('express');
var port = process.env.PORT || 7070;
var app = express();

var server = require('http').createServer(app);
server.listen(port);


if (process.env.NODE_ENV == 'prod') {
    console.log('Production Mode - Serving /bin folder on port: ' + port);
    app.use(express.static(__dirname + '/bin'));    
} else if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === '') {
    console.log('Dev Mode - Serving /build folder on port: ' + port);
    app.use(express.static(__dirname + '/build'));

    if (process.env.NODE_ENV === 'dev') {
        runInterval = true;
    }
} else {
    console.log('Environment Variable Not Found - Dev Mode! - Serving /build folder on port: ' + port);
    app.use(express.static(__dirname + '/build'));  
}