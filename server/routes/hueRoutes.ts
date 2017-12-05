import { HueApi, lightState } from "node-hue-api"
var express = require('express');
var router = express.Router();

import { hueInfo } from '../config'

const hueApi = new HueApi(hueInfo.bridgeIp, hueInfo.username);

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

export default router