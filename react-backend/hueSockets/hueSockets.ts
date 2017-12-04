import { HueApi, lightState } from "node-hue-api"


import config from '../config'
export const server = require('http').createServer();
// var io = require("socket.io")(server)
import * as io from 'socket.io'

const ioServer = io(server)

/**
 * Set up hue api and socket.io
 */
  
const hueApi = new HueApi(config.bridgeIp, config.username);

export const initHueSockets = () => {
  hueApi.lights().then( (result) => {
    for (const light of result.lights) {
      createLightSocket(light)
    }
  })
}

function createLightSocket(light) {
  console.log('Creating socket for light: ', light.id)
  const lightSocket = ioServer.of(`/${light.id}`)
  lightSocket.on('connection', (socket) => {
    configureSocket(socket, light)
  })
}

function configureSocket(socket: SocketIO.Socket, light) {
  console.log(`Connected light '${light.id}'`)
  socket.on('disconnect', () => { console.log(`Disconnected light '${light.id}'`) })
  socket.on('requestStateChange', (requestedState) => {
    console.log(`New request for lamp: ${light.id}! \n ${JSON.stringify(requestedState)}`)
    hueApi.setLightState(light.id, requestedState)
    .then((result) => {
      socket.emit('stateChanged', requestedState)
    })
  })
}