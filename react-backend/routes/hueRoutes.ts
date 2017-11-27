import { HueApi, lightState } from "node-hue-api"
var express = require('express');
var router = express.Router();
var server = require('http').createServer();
var io = require("socket.io")(server)


/**
 * Set up hue api and socket.io
 */
const data = {
  bridgeIp: "192.168.0.17",
  username: "uFU2e7sEn7I0aHr5zD00eurb8jrkscqOEgnYjeNI"
}

const hueApi = new HueApi(data.bridgeIp, data.username);

hueApi.lights().then( (result) => {
  for (const light of result.lights) {
    console.log('Creating socket for light: ', light.id)
    const lightSocket = io.of(`/${light.id}`)
    lightSocket.on('connection', (socket) => {
      console.log(`Connected light '${light.id}'`)

      socket.on('disconnect', () => { console.log(`Disconnected light '${light.id}'`) })
      socket.on('requestStateChange', (requestedState) => {
        console.log(`New request for lamp: ${light.id}! \n ${JSON.stringify(requestedState)}`)
        hueApi.setLightState(light.id, requestedState)
        .then((result) => {
          lightSocket.emit('stateChanged', requestedState)
        })
      })
    })
  }
})

server.listen(8080);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("hueRoutes")
});

router.get('/light/:id', async (req,res,next) => {
  res.setHeader('Content-Type', 'application/json');
  hueApi.lights()
  .then((lights) => {
      for (let light of lights.lights) {
        if (light.id == req.params.id) {
          res.send(light)
          break;
        }
    }
  })
})

router.get('/light', async (req,res,next) => {
  res.setHeader('Content-Type', 'application/json');
  const lights = await hueApi.lights()
  res.send(lights.lights)
})

module.exports = router;
