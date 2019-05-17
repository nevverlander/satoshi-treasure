import React from "react";
import {Comment} from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import Message from "./Message";
import moment from "moment";
import MessageForm from "./MessageForm";

class Messages extends React.Component {
  state = {
    messages: [],
    messagesLoading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    progressBar: false
  };

  componentDidMount = () => {
    const {channel, user} = this.state;

    if (channel && user) {
      this.setState(
        {
          messagesRef: firebase
            .firestore()
            .collection("channels")
            .doc(channel.id)
            .collection("messages")
        },
        () => {
          this.addListeners(channel.id);
        }
      );
    }
  };

  componentWillUnmount = () => {
    this.removeListeners();
  };

  removeListeners = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.unsubscribe = this.state.messagesRef.onSnapshot(snap => {
      snap.docChanges().forEach(function (change) {
        if (change.type === "added") {
          //console.log("New message added: ", change.doc.data());
          loadedMessages.push(change.doc.data());
        }
      });
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  isProgressBarVisible = percent => {
    if (percent > 0) {
      this.setState({progressBar: true});
    }
  };
  TimeStamp = ()=>{
    return(
      <div style={{display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center'}}>
        <div style={styles.divider}/>
        <div style={{marginLeft: 10, marginRight: 10}}>{moment().format("dddd, MMMM Do YYYY")}</div>
        <div style={styles.divider}/>
      </div>
    );
  }
  render() {
    const {messagesRef, messages, channel, user, progressBar} = this.state;

    return (
      <React.Fragment>
        <div style={{display: 'flex', flexDirection: 'column',width: '100%'}}>
          <MessagesHeader channel={channel}/>
          {this.TimeStamp()}
          <div>
            <Comment.Group
              className={progressBar ? "messages__progress" : "messages"}
            >
              {messages.map(message => (
                <Message
                  key={message.timestamp}
                  message={message}
                  user={this.state.user}
                />
              ))}
            </Comment.Group>
          </div>
        </div>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isProgressBarVsible={this.isProgressBarVisible}
        />
      </React.Fragment>
    );
  }
}

const styles = {
  divider: {
    backgroundColor: '#e7e7e7',
    height: 1,
    width: '36%'
  }
};
export default Messages;
