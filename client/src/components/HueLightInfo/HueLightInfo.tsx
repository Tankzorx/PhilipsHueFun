// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';

import { HueLight } from '../HueOverview/HueOverview'
// import HueLightState from '../HueLightState/HueLightState'

interface HueLightInfoProps {
  socket: SocketIOClient.Socket;
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
        <div className={`hue-light ${this.props.light.state.on ? 'on' : 'off'} flexcontainer`}
            onClick={this.handleShowDetails}
        >
            <div >
                <div className="lightProps">
                    <h2>
                        { this.props.light.name}
                    </h2>
                    {
                        this.state.showDetails ? 
                        <div>
                            Details show!
                        </div>
                        :
                        <div>
                            Details hide!
                        </div>
                    }
                </div>
            </div>
        </div>
    )
  }
}

export default HueLightInfo;
