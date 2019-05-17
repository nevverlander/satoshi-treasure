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
					<img src={channel.img} width="500" height="500" alt="" />
				) : (
					<div />
				)}
				<p> Finders: {hunters}</p>
				<p> Helpers: </p>
				<ul>
					{helpers.map(helper => (
						<li key={helper}>{helper}</li>
					))}
				</ul>
			</div>
		);
	}
}

export default MetaPanel;
