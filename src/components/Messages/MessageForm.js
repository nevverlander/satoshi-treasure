import React from "react";
import uuidv4 from "uuid/v4";
import {Button, Input} from "semantic-ui-react";
import {Dropdown, Menu} from 'antd';
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    message: "",
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  };

  /* form event */
  handleChange = event => {
    console.log("event", event);
    this.setState({[event.target.name]: event.target.value});
  };

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  /* upload file event */
  openModal = () => this.setState({modal: true});

  closeModal = () => this.setState({modal: false});

  /* firebase event*/
  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message } = this.state;

    if (message) {
      this.setState({
        loading: true
      });
      let msgDocRef = messagesRef.doc();
      let msgData = this.createMessage();
      msgData.id = msgDocRef.id;
      msgDocRef
        .set(msgData)
        .then(() => {
          this.setState({
            loading: false,
            errors: []
          });
        })
        .catch(err => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({message: "Add a message"})
      });
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.name;
    const ref = this.props.messagesRef;
    const filePath = `${pathToUpload}/${uuidv4()}`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref) => {
    ref
      .add(this.createMessage(fileUrl))
      .then(() => {
        this.setState({uploadState: ""});
      })
      .catch(err => {
        console.error(err);
        this.setState({errors: this.state.errors.concat(err)});
      });
  };
  menu = (
    <Menu>
      <Menu.Item>
        <div onClick={this.openModal}>
          Upload Media
        </div>
      </Menu.Item>
    </Menu>
  );

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded
    } = this.state;

    return (
      <div className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{marginBottom: "0.7em"}}
          label={
            <Dropdown overlay={this.menu} placement="bottomLeft">
              <Button icon={"add"}/>
            </Dropdown>
          }
          labelPosition="left"
          className={
            errors.some(error => error.includes("message")) ? "error" : ""
          }
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              console.log('event', event);
              this.setState({message: ""})
              this.sendMessage();
            }
          }}
          placeholder="Write your message"
        />
        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </div>
    );
  }
}

export default MessageForm;
