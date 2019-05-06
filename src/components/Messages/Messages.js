import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.firestore().collection("messages"),
    messages: [],
    messagesLoading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    progressBar: false
  };

  componentDidMount = () => {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.doc(channelId).onSnapshot(snap => {
      loadedMessages.push(snap.data());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages => {
    console.log("messages", messages);
    messages.length > 0 &&
      messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.state.user}
        />
      ));
  };

  isProgressBarVisible = percent => {
    if (percent > 0) {
      this.setState({ progressBar: true });
    }
  };

  render() {
    const { messagesRef, messages, channel, user, progressBar } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group
            className={progressBar ? "messages__progress" : "messages"}
          >
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

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

export default Messages;
