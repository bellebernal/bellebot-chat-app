import React from 'react';
import styles from './App.css'
import Chatkit from '@pusher/chatkit'
// import Message from './components/Message.js'
import MessageList from './components/MessageList'
//import SendMessageForm from './components/SendMessageForm'
//import RoomList from './components/RoomList'
//import NewRoomForm from './components/NewRoomForm'
import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: []
    }
  }

  //To hook a react component to an API:  use lifecycle method componentDidMount()
  //this method is triggered right after the render() method
  componentDidMount() {
     const chatManager = new Chatkit.ChatManager({
       instanceLocator,
       userId: 'cyberbelle',
       tokenProvider: new Chatkit.TokenProvider({
         url: tokenUrl
       })
     })

     //this returns a promise and when this promise is resolved we get access to the 
     //...current user -- and the currentUser object contains a bunch of methods for interacting with the API
     //currentUser here is our interface for interacting with the chatkit API
    chatManager.connect()
      .then(currentUser => {
        currentUser.subscribeToRoom ({
          //room id generated from pusher chatkit engine
          roomId: 11213510,
          //we need to provide a hook here: an event listener for new messages
          //we want to me notified of a new message in the chatroom
          //messageLimit: 20, this is an option attribute--the default is 20
          hooks: {
            //event-handler
            onNewMessage: message => {
              // console.log('message.text: ', message.text);
              //for every new message we get from chatkit, we are describing its new state:
              this.setState({
                //use spread operator to add a copy of the messages array (the this.state.messages array) and add the latest message (line 42) to the end of it 
                messages: [...this.state.messages, message]
              })
            }
          }
        })
      })
    }

  render() {
    // console.log('this.state.messages: ', this.state.messages);
    return (
      <div className="app">
        {/* <header className="App-header">
        \
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <RoomList/> */}
        <MessageList messages={this.state.messages} />
        {/* <SendMessageForm/> */}
        {/* <NewRoomForm/> */}
      </div>
    );
  }
}

export default App;


//CHATKIT TEST TOKEN PROVIDER:
//only for testing purposes
//what you'd rather have in production is is an endpoint which you have 
//...created for exampte, using node -- and ther you would authenticate 
//..the user which you can so using the chatkit server sdk.

//STATE + PROPS:
// when using these features, you must first add a constructor to your app component
// SPREAD OPERATOR - '...' -> allows you to expand the this.state.messages array into the newly modified array so as not to use the previous version/state of that array it was origianlly defined as (line 15)
// -> this array: ...this.state.messages is expanded to be included in the new state array; essentially, taking away the use of [[this.state.messages], message] bc here we are referenceing the old state version but we want to instead create a copy it and make a new verison of it (the updated state version)
// - using message: this.state.messages.push(message) should not be used becuase this push method forcefully updates the orginial (old) array but we do not want to do that as we must keep the original state and work from that version and update it state by creating a copy of it
//PROPS - passing data received in the component to its' selector via property attributes 
//*NOTE: '.state' is private and only lives in the App component (via a component's selector); we do not use 'state' keyword in the child compnoent (e.g. MessageList); hence why 'props' is used in the MessageList component (line 24 MessageList.js)