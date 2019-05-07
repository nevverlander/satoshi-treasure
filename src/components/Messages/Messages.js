import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messages: [],
    messagesLoading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    progressBar: false
  };

  componentDidMount = () => {
    const { channel, user } = this.state;

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

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.onSnapshot(snap => {
      snap.docChanges().forEach(function(change) {
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
            {messages.map(message => (
              <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
              />
            ))}
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
