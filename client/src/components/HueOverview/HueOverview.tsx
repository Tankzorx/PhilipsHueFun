// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';
import './HueOverview.css';

import HueLightInfo from '../HueLightInfo/HueLightInfo'

interface HueInfoProps {
}

export interface HueLight {
  id: string;
  name: string;
  state: HueLightState;
}

export interface HueLightState {
  on?: boolean;
  bri?: number;
  ct?: number;
  alert?: string;
  colormode?: string;
  reachable?: boolean;
}

interface HueInfoState {
  hueLights: HueLight[];
}

class HueRegister extends React.Component<HueInfoProps, HueInfoState> {

    props: HueInfoProps
    state: HueInfoState

  constructor(props: HueInfoProps) {
    super(props);
    this.state = {hueLights: []}
    // this.handleFoldOut = this.handleFoldOut.bind(this)
  }

  componentDidMount() {
    fetch(`hue/light/`)
    .then(res => res.json())
    .then( (lights) => {
      console.log(lights)
      const hueLights = lights.map((light: any) => {
        return {
          name: light.name,
          id: light.id,
          state: light.state
        }
      })
      this.setState((prevState) => {
          return { hueLights }
      })
    })
  }

  public render() {
    const lightComponents = this.state.hueLights.map((light) => {
      return (
          <HueLightInfo light={light}/>
      )
    })

    return (
      <div className="hueoverview">
        <div>
          { 
            lightComponents
          }
        </div>
      </div>
    )
  }
}

export default HueRegister;
