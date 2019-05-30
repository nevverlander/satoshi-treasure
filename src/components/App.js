import React from "react";
import {Grid} from "semantic-ui-react";
import {connect} from "react-redux";
import "./App.css";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

const App = ({currentUser, currentChannel}) => (
  <Grid columns="equal" className="app" style={{background: "#fff"}}>
    {/*<ColorPanel />*/}

    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser}/>

    <Grid.Column style={{marginLeft: 200, borderRight: '2px #e7e7e7 solid'}}>
      <Messages
        key={currentChannel && currentChannel.name}
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>

    <Grid.Column width={3} only='computer'>
      <MetaPanel
        key={currentChannel && currentChannel.name}
        currentChannel={currentChannel}
      />
    </Grid.Column>
  </Grid>
);
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);
