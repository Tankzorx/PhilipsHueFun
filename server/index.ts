#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app'
import { server as socketServer, initHueSockets } from './hueSockets/hueSockets'
import { setupBot } from './fbBot/bot'
var debug = require('debug')('react-backend:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var serverPort = normalizePort(process.env.SERVER_PORT || '3001');
var hueSocketPort = normalizePort(process.env.HUE_PORT || '8080');
app.set('port', serverPort);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

initHueSockets()

socketServer.listen(hueSocketPort)
socketServer.on('listening', () => {
  console.log('Hue sockets listening');
  console.log('Initializing Facebook bot')
  setupBot((err) => {
    if (err) {
      console.log('Error when starting facebook bot:')
      console.log(err)
    }
    console.log('Facebook bot operational.')
    server.listen(serverPort);
    server.on('error', onError);
    server.on('listening', onListening);
  })
})


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof serverPort === 'string'
    ? 'Pipe ' + serverPort
    : 'Port ' + serverPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
