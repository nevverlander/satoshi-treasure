const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");

const config = {
	apiKey: "AIzaSyC9dBhOw_P_OcRntT5m3SrcKBOuc3A7P3k",
	authDomain: "satoshi-treasure.firebaseapp.com",
	databaseURL: "https://satoshi-treasure.firebaseio.com",
	projectId: "satoshi-treasure",
	storageBucket: "satoshi-treasure.appspot.com",
	messagingSenderId: "902859017629",
	appId: "1:902859017629:web:361d67aee21b29c1"
};
firebase.initializeApp(config);

export default firebase;
