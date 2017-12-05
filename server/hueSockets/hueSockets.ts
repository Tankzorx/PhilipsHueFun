import { HueApi, lightState } from "node-hue-api"


import config from '../config'
export const server = require('http').createServer();
// var io = require("socket.io")(server)
import * as io from 'socket.io'
import { request } from "http";

const ioServer = io(server)

/**
 * Set up hue api and socket.io
 */
  
const hueApi = new HueApi(config.hueInfo.bridgeIp, config.hueInfo.username);

export const initHueSockets = () => {
  hueApi.lights().then( (result) => {
    for (const light of result.lights) {
      createLightSocket(light)
    }
  })
}

function createLightSocket(light) {
  console.log('Creating socket for light: ', light.id)
  const lightSocket: SocketIO.Namespace = ioServer.of(`/${light.id}`)
  lightSocket.on('connection', (socket) => {
    console.log(`Connected light '${light.id}'`)
    configureSocket(socket, light)
  })
}

function configureSocket(socket: SocketIO.Socket, light) {
  socket.on('disconnect', () => { console.log(`Disconnected light '${light.id}'`) })
  socket.on('requestStateChange', (requestedState) => {
    handleStateChangeRequest(requestedState, light, socket)
  })
}

function handleStateChangeRequest(requestedState, light, socket) {
    console.log(`New request for lamp: ${light.id}! \n ${JSON.stringify(requestedState)}`)
    hueApi.setLightState(light.id, requestedState)
    .then((result: boolean) => {
      console.log(result)
      if (result) {
        socket.emit('stateChanged', { requestedState, success: true })
      } else {
        socket.emit('stateChanged', { requestedState, success: false})
      }
    })
}