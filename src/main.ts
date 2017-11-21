import { HueApi, lightState } from "node-hue-api"
import data from "./data"
import startServer from "./server"

const api = new HueApi(data.bridgeIp, data.username);

async function turnOffLight() {
    let increasing = true
    let brightness = 80
    let state = lightState.create().on().brightness(brightness).xy(0.5,0.5)
    let stepPercentage = 5
    
    api.setLightState(4, state)
    .then((res) => {
        console.log(res)
    }).done()

    setInterval(() => {
        if (increasing === true) {
            brightness += stepPercentage
            state = lightState.create().on().brightness(brightness).xy(brightness/100,1)
            if (brightness === 100) {
                increasing = false
            }
            
        } else {
            brightness -= stepPercentage
            state = lightState.create().on().brightness(brightness)
            if (brightness === 20) {
                increasing = true
            }
        }
        console.log(brightness)
        api.setLightState(4, state)
        .then((res) => {
            console.log(res)
        }).done()
    }, 500)
}

startServer()


// turnOffLight()