import React from "react";
import firebase from "../../firebase";
class MetaPanel extends React.Component {
  state = {
    channel: this.props.currentChannel,
    hunters: "",
    helpers: []
  };

  componentDidMount = () => {
    const { channel } = this.state;
    if (channel) {
      this.setState(
        {
          huntersRef: firebase
            .firestore()
            .collection(process.env.REACT_APP_FIRESTORE_ROOT_REF)
            .doc(process.env.REACT_APP_FIRESTORE_HUNTERS_REF)
            .collection(process.env.REACT_APP_FIRESTORE_KEYS_REF)
            .doc(channel.name)
        },
        () => {
          this.addListeners();
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

  addListeners = () => {
    this.fetchHunters();
  };

  fetchHunters = async () => {
    let doc = await this.state.huntersRef.get();
    // finders
    let findersObj = doc.data().finders;
    let finders = "";
    Object.keys(findersObj).forEach(finder => {
      finders += finder + ", ";
    });
    finders = finders.substring(0, finders.length - 2);

    // helpers
    let helpersObj = doc.data().helpers;
    let helpers = [];
    Object.keys(helpersObj).forEach(helper => {
      helpers.push(helper);
    });
    this.setState({ helpers, hunters: finders });
  };
	render() {
    const { channel, hunters, helpers } = this.state;
    return (
			<div>
        {channel ? (
          <img src={channel.img} width="300" height="300" alt="" />
        ) : (
          <div />
        )}
        <p style={{paddingLeft: 20, color: "#49525d"}}> Finders: {hunters}</p>
        <p style={{paddingLeft: 20, color: "#49525d"}}> Helpers: </p>
        <ol>
          {helpers.map(helper => (
            <li style={styles.item} key={helper}>{helper}</li>
          ))}
        </ol>
			</div>
		);
	}
}

const styles = {
  item: {
    color: "#8390a3",
    fontsize: 12,
    paddingTop: 3,
    paddingBottom: 3
  }
}
export default MetaPanel;
