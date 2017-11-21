// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';

interface HueLightState {
  on?: boolean;
  bri?: number;
  ct?: number;
  alert?: string;
  colormode?: string;
  reachable?: boolean;
}



interface HueLightStateProps {
  socket: SocketIOClient.Socket;
  lightId: string;
}

class HueLightInfo extends React.Component<HueLightStateProps, HueLightState> {

    props: HueLightStateProps
    state: HueLightState

  constructor(props: HueLightStateProps) {
    super(props);
    this.handleFoldOut = this.handleFoldOut.bind(this)
  }


  public handleFoldOut() {
    
  }

  componentDidMount() {
   this.props.socket.emit('requestHueData', { light: this.props.lightId})

   this.props.socket.on(`HueLight${this.props.lightId}`, (light: any) => {
    console.log(light)
   })
  }

  public render() {
    return (
        <div className="lightState">
          state
        </div>
    )
  }
}

export default HueLightInfo;
