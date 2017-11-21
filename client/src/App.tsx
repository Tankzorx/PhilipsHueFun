import * as React from 'react';
import * as io from 'socket.io-client'
import './App.css';

import HueOverview from './components/HueOverview/HueOverview'

interface User {
  id: number;
  name: string;
}

interface AppState {
  users?: User[];
}

class App extends React.Component<{}, AppState> {

  state = { users: [] as User[] }

  socket: SocketIOClient.Socket

  constructor(props: {}) {
    super(props);
    this.socket = io('localhost:8080')
    this.state = { users: []};
  }

  componentDidMount() {
    // this.setState((prevState : HueRegisterState) => {
    //   return {
    //     socket: socket,
    //     messages: []
    //   }
  }

  public render() {
    console.log('rendered users: ', this.state.users)

    return (
      <div className="App">
        <div>
          <HueOverview socket={this.socket} />
        </div>
      </div>
    );
  }
}

export default App;
