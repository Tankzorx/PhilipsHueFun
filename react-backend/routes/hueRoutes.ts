import { HueApi, lightState } from "node-hue-api"
var express = require('express');
var router = express.Router();
var server = require('http').createServer();
var io = require("socket.io")(server)

const data = {
  bridgeIp: "192.168.0.17",
  username: "uFU2e7sEn7I0aHr5zD00eurb8jrkscqOEgnYjeNI"
}

interface ioHueRequest {
  lights?: string[] | 'all';
}

const hueApi = new HueApi(data.bridgeIp, data.username);


io.on("connection", (client: SocketIO.Socket) => {
  console.log('user connected')
  client.on('event', function(data) {
    console.log(data)
  })

  client.on('disconnect', () => {
    console.log("disconnected")
  })

  client.on('one', (value) => {
    console.log(value)
  })

  client.on('requestHueData', (req) => {
    console.log(req)

    // for (let reqProp in req) {
    //   switch (reqProp) {
    //     case "lights": 
    //       if (req.lights === 'all') {
    //         hueApi.lights().then((lights) => {
    //           client.emit('HueAllLights', lights)
    //         })
    //       } else {
    //         hueApi.lights().then((lights) => {
    //           client.emit(`HueLight${req.lights}`, lights[req.lights])
    //         })
    //       }
    //       break;
    //   }
    // }
  })
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
