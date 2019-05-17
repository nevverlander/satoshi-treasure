import React from "react";
import {Menu} from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";

class SidePanel extends React.Component {
  render() {
    const {currentUser} = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{background: "#fff", fontSize: "1.2rem", borderRightWidth: 2, borderRightColor: '#99989c', width: 200}}
      >
        <UserPanel currentUser={currentUser}/>
        <Channels currentUser={currentUser}/>
      </Menu>
    );
  }
}

export default SidePanel;
