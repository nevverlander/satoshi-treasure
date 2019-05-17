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
    progressBar: false,
    numLoadedMsgs: 300
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
    this.unsubscribe = this.state.messagesRef
      .orderBy("timestamp", "desc")
      .limit(this.state.numLoadedMsgs)
      .onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added") {
            //console.log("New message added: ", change.doc.data());
            if (change.doc.metadata.hasPendingWrites) {
              loadedMessages.push(change.doc.data());
            } else {
              loadedMessages.unshift(change.doc.data());
            }
            // limit num elements in array
            if (loadedMessages.length > this.state.numLoadedMsgs) {
              let delta = loadedMessages.length - this.state.numLoadedMsgs;
              loadedMessages = loadedMessages.slice(delta);
            }
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
                key={message.id}
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
