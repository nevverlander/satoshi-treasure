import React from "react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import {setCurrentChannel} from "../../actions";
import {Button, Form, Icon, Input, Menu, Modal} from "semantic-ui-react";

class Channels extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetail: "",
    channelsRef: firebase.firestore().collection("channels"),
    modal: false,
    firstLoad: true
  };

  /* about listeners for firebase */
  componentDidMount = () => {
    this.addListeners();
  };

  componentWillUnmount = () => {
    this.removeListeners();
  };

  addListeners = () => {
    let loadedChannels = [];
    const {channelsRef} = this.state;
    this.unsubscribe = channelsRef.onSnapshot(snap => {
      snap.docChanges().forEach(function (change) {
        if (change.type === "added") {
          //console.log("New channel added: ", change.doc.data());
          loadedChannels.push(change.doc.data());
        }
      });
      this.setState({channels: loadedChannels}, () => {
        this.setFirstChannel();
      });
    });
  };

  removeListeners = () => {
    this.unsubscribe();
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  /* form event */
  isFormValid = ({channelName, channelDetail}) =>
    channelName && channelDetail;

  addChannel = () => {
    const {channelsRef, channelName, channelDetail, user} = this.state;
    const newChannelRef = channelsRef.doc();
    const newChannel = {
      id: newChannelRef.id,
      name: channelName,
      details: channelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    newChannelRef
      .set(newChannel)
      .then(() => {
        this.setState({
          channelName: "",
          channelDetail: ""
        });
        this.closeModal();
        //console.log("Channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  /* view event about form */
  closeModal = () => this.setState({modal: false});

  openModal = () => this.setState({modal: true});

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({firstLoad: false});
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = channel => {
    this.setState({
      activeChannel: channel.id
    });
  };

  render() {
    const {channels, modal} = this.state;

    return (
      <React.Fragment>
        <Menu.Menu style={{paddingBottom: "2em"}}>
          <Menu.Item
            style={{color: '#49525d'}}
          >
            <span>Channels ({channels.length})</span>
            <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {channels.map(channel => (
            <Menu.Item
              key={channel.id}
              onClick={() => this.changeChannel(channel)}
              name={channel.name}
              style={{
                color: '#49525d', borderRadius: 10,
                paddingTop: 13,
                paddingBottom: 13,
                marginTop: 10
              }}
              color={'blue'}
              active={channel.id === this.state.activeChannel}
            >
              # {channel.name}
            </Menu.Item>
          ))}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetail"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark"/>
              Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"/>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  {setCurrentChannel}
)(Channels);
