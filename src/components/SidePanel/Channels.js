import React from "react";
import firebase from "../../firebase";
import {connect} from "react-redux";
import {setCurrentChannel} from "../../actions";
import {Button, Form, Icon, Input, Menu, Modal} from "semantic-ui-react";
require("dotenv").config();
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
    modal: false,
    firstLoad: true
  };

  /* about listeners for firebase */
  componentDidMount = () => {
    this.setState(
      {
        channelsRef: firebase
          .firestore()
          /*.collection(process.env.REACT_APP_FIRESTORE_ROOT_REF)
          .doc(process.env.REACT_APP_FIRESTORE_CHANNELS_REF)
          .collection(process.env.REACT_APP_FIRESTORE_KEYS_REF)*/

          .collection("channels")
          .doc("xolQV0Q6FqTRlNEgbfNc")
          .collection("messages")
      },
      () => {
        this.addListeners();
      }
    );
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
      activeChannel: channel.name
    });
  };

  render() {
    const { channels } = this.state;

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
              key={channel.name}
              onClick={() => this.changeChannel(channel)}
              name={channel.name}
              style={{
                color: '#49525d', borderRadius: 10,
                paddingTop: 13,
                paddingBottom: 13,
                marginTop: 10
              }}
              color={'blue'}
              active={channel.name === this.state.activeChannel}
            >
              # {channel.name}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel }
)(Channels);
