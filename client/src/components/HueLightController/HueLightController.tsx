// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';
import * as io from 'socket.io-client'

import { HueLight } from '../HueOverview/HueOverview'

interface HueLightControllerState {
  light: HueLight;
  socket: SocketIOClient.Socket;
}

interface HueLightControllerProps {
  light: HueLight;
  onLightStateChange: any;
}

class HueLightController extends React.Component<HueLightControllerProps, HueLightControllerState> {

    state: HueLightControllerState

  constructor(props: HueLightControllerProps) {
    super(props);
    this.state = {
        light: props.light,
        socket: io(`localhost:8080/${this.props.light.id}`)
      }
    this.handleSwitch = this.handleSwitch.bind(this)
  }
  
  private setStateWrapper (stateChangeFunc: any) {
      this.setState((prevState) => stateChangeFunc(prevState))
      this.props.onLightStateChange(this.state.light.state)
  }

  componentDidMount() {
    this.setState( (prevState) => {
      return {
        ...prevState,
      }
    })

    this.state.socket.on('stateChanged', (result: { requestedState: any, success: boolean}) => {
      console.log('state Change:', result)
      console.log('old state:', this.state)
      if (result.success) {
        this.setStateWrapper((prevState: HueLightControllerState) => {
          return {
            light: {
              state: {
                ...prevState.light.state,
                ...result.requestedState
              }
            }
          }
        })
      } else {

      }
    })
  }

  public handleSwitch(e: any) {
    e.stopPropagation()
    console.log('request switch of', this.props.light.id)
    e.preventDefault()
    if (this.state.socket !== undefined) {
      this.state.socket.emit('requestStateChange', {
        on: !this.state.light.state.on
      })
    }
  }

  componentWillUnmount() {
    if (this.state.socket !== undefined) {
      console.log('Disconnecting lamp:', this.props.light.id)
      this.state.socket.disconnect()
    }
  }

  public render() {
    return (
        <div className="lightState">
          <button onClick={this.handleSwitch}>
            Turn { (!this.state.light.state.on) ? 'on' : 'off'}
          </button>
        </div>
    )
  }
}

export default HueLightController;
