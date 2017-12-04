// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';

import './HueLightInfo.css'
// const styles = require('./HueLightInfo..css')
// import * as styles from "./HuelightInfo.css";
// const Style = require<any>("./HuelightInfo.css");


import { HueLight, HueLightState } from '../HueOverview/HueOverview'
import HueLightController from '../HueLightController/HueLightController'

interface HueLightInfoProps {
  light: HueLight;
}

interface HueLightInfoState {
    showDetails: boolean;
    light: HueLight;
}

class HueLightInfo extends React.Component<HueLightInfoProps, HueLightInfoState> {

    props: HueLightInfoProps
    state: HueLightInfoState

  constructor(props: HueLightInfoProps) {
    super(props);
    this.state = { showDetails: false, light: props.light }
    this.handleShowDetails = this.handleShowDetails.bind(this)
    this.onLightStateChange = this.onLightStateChange.bind(this)
  }

  public onLightStateChange (newLightState: HueLightState) {
    console.log("light state changed: ", newLightState)
    this.setState( (prevState) => {
        return {
            light: {
                state: {
                    ...newLightState
                }
            }
        }
    })
  }

  public handleShowDetails() {
    console.log("show details of :", this.state.light.name)
    this.setState( (prevState: HueLightInfoState) => {
        return {
            showDetails: !prevState.showDetails
        }
    })
  }

  componentDidMount() {
    // fetch(`hue/light/${this.props.lightId}`)
    // .then((res) => res.json())
    // .then( (light) => {
    //     console.log(light.state.on)
    //     this.setState((prevState) => {
    //         return {
    //             name: light.name,
    //             lightState: light.state
    //         }
    //     })
    // })
  }

  public render() {
    return (
        <div className={`hue-light ${this.state.light.state.on ? 'on' : 'off'} flexcontainer`}
            onClick={this.handleShowDetails}
        >
            <div >
                <div className="lightProps">
                    <h2 className="lightName">
                        { this.props.light.name}
                    </h2>
                    <div className="lightSwitchButton">
                        <HueLightController light={this.props.light} onLightStateChange={this.onLightStateChange}/>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default HueLightInfo;
