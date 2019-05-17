require("dotenv").config();

let firebase = require("firebase-admin");
let serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_FILE);
let args = process.argv.slice(2);

let numIters = args[0];

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount)
});

let ref = firebase
	.firestore()
	.collection("channels")
	.doc("xolQV0Q6FqTRlNEgbfNc")
	.collection("messages");

let content = "message time: " + new Date();

const message = {
	timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	user: {
		id: "7FOUS4lKBocJ5fds3VsO5nYLNFq2",
		name: "load",
		avatar:
			"http://gravatar.com/avatar/743173788aa9166801df2e18f0e7ff24?d=identicon"
	},
	content: content
};

for (let i = 0; i < numIters; i++) {
	ref.add(message)
		.then(() => {
			console.log("added message");
		})
		.catch(err => {
			console.log("error occured", err);
		});
}
