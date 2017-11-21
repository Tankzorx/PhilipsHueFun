// import * as React from '../../../node_modules/@types/react';
import * as React from 'react';


interface HueRegisterProps {
  socket: SocketIOClient.Socket;
}

interface HueRegisterState {
    messages: string[]
}

class HueRegister extends React.Component<HueRegisterProps, HueRegisterState> {

    props: HueRegisterProps
    state: HueRegisterState

  constructor(props: HueRegisterProps) {
    super(props);
    this.state = { messages: [] }
    this.handleConnect = this.handleConnect.bind(this);
  }

  handleConnect() {
    this.props.socket.emit('hueCommand')
  }

  componentDidMount() {

    this.props.socket.on('message', (msg: string) => {
      this.setState((prevState: HueRegisterState) => {
        prevState.messages.push(msg)
        return {
          messages: prevState.messages
        }
      })
    })
  }

  public render() {


    return (<div>
        HueRegister
        <button onClick={this.handleConnect}>
        connect
        </button>

      </div>
    )
  }
}

export default HueRegister;
