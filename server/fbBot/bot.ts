import { HueApi, lightState } from "node-hue-api"
import * as async from 'async'
import config from '../config'
import { ParsedPath } from "path";

const login = require("facebook-chat-api");

const hueApi = new HueApi(config.hueInfo.bridgeIp, config.hueInfo.username);

interface HueLightState {
    on?: boolean;
    bri?: number;
    ct?: number;
    alert?: string;
    colormode?: string;
    reachable?: boolean;
  }

interface ParsedRequest {
    lamps: string[];
    groups: string[];
    requestedState: HueLightState;
}

let lightGroups, lights;

export function setupBot(cb: (err: Error) => void) {

    async.waterfall([
        (asyncCb) => {
            hueApi.getFullState().then((state) => {
                console.log("-------------------------------------");
                console.log(state)
                console.log("-------------------------------------");
                asyncCb(null, state)
            }).done()
        },
        (fullHueState, asyncCb) => {
            login({ email: config.facebookDetails.email, password: config.facebookDetails.password }, (err, api) => {
                if (err) {
                    asyncCb(err)
                }
                api.setOptions({
                    logLevel: "warn"
                })
                api.listen((err, message) => {
                    // message type:
                    // { type: 'message',                                
                    // senderID: '1557436596',                         
                    // body: 'hej',                                    
                    // threadID: '1557436596',                         
                    // messageID: 'mid.$cAABa8ys_atlmWc4LGlgKIi6BP7Np',
                    // attachments: [],                                
                    // timestamp: '1512508539674',                     
                    // isGroup: false }                                
                    const parsedReq: ParsedRequest = parseMessage(message.body, fullHueState)
                    async.parallel([
                        ...parsedReq.lamps.map((lamp) => {
                            return (cb) => {
                                hueApi.setLightState(lamp, parsedReq.requestedState)
                                .then((result) => {
                                    cb()
                                })
                            }
                        }),
                        ...parsedReq.groups.map( (group) => {
                            return (cb) => {
                                hueApi.setGroupLightState(group, parsedReq.requestedState)
                                .then((result) => {
                                    cb()
                                })
                            }
                        })
                    ], (err) => {
                        if (err) {
                            console.log(err)
                        }
                        const responseText = constructResponseFromParsedRequest(parsedReq, fullHueState)
                        api.sendMessage(responseText, message.threadID)
                    })
                    
                })
                asyncCb(null)
            })
        },
    ], (err: Error, results) => {
        cb(err)
    })
}

function getLightName(id, fullHueState) {
    return fullHueState['lights'][id]['name']
}

function getGroupName(id, fullHueState) {
    return fullHueState['groups'][id]['name']
}

function constructResponseFromParsedRequest(parsedReq: ParsedRequest, fullHueState) {
    let groupsString = "";
    let lampsString = "";
    if (parsedReq.lamps.length > 0) {
        lampsString = ` - Lamps changed:\n${parsedReq.lamps.map((lampId) => `    - '${getLightName(lampId, fullHueState)}' `)}\n`
    } else {
        lampsString = ` - No lights were changed\n`
    }


    if (parsedReq.groups.length > 0) {
        groupsString = ` - Groups changed:\n${parsedReq.groups.map((groupId) => `    - '${getGroupName(groupId, fullHueState)}' `)}\n`
    } else {
        groupsString = ` - No groups were changed\n`
    }

    return `Here's what happened:\n. ${lampsString} ${groupsString} `
}
function parseMessage(message, fullHueState): ParsedRequest {
    let requestedState: HueLightState
    const lamps: string[] = []
    const groups: string[] = [];

    const turnOn = message.match(/(tænd|turn on|on)/)
    const turnOff = message.match(/(sluk|turn off|off)/)
    if (turnOff) {
        requestedState = {
            on: false
        }
    } else {
        requestedState = {
            on: true
        }
    }

    for (const light in fullHueState["lights"]) {
        console.log(light)
        if (fullHueState["lights"].hasOwnProperty(light)) {
            const lightState = fullHueState["lights"][light];
            if (lightState["name"] && message.match(lightState["name"])) {
                console.log(`pushed ${light} '${lightState["name"]}' to lamps`)
                lamps.push(light)
            }
        }
    }

    for (const group in fullHueState["groups"]) {
        console.log(group)
        if (fullHueState["groups"].hasOwnProperty(group)) {
            const groupState = fullHueState["groups"][group];
            if (groupState["name"] && message.match(groupState["name"])) {
                console.log(`pushed ${group} '${groupState["name"]}' to groups`)
                groups.push(group)
            }
        }
    }

    return {
        lamps,
        groups,
        requestedState
    }

}