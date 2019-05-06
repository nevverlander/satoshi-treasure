import React from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser
  };

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as
          <strong>{this.state.user.displayName}</strong>{" "}
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span> Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}> Sign Out</span>
    }
  ];

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out!");
      });
  };

  render() {
    const { user } = this.state;
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {" "}
            <Header style={{ padding: "0.25em" }} inverted as="h4">
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />{" "}
                    {user.displayName}{" "}
                  </span>
                }
                options={this.dropdownOptions()}
              />{" "}
            </Header>{" "}
          </Grid.Row>{" "}
          {/* User DropDown */}{" "}
        </Grid.Column>{" "}
      </Grid>
    );
  }
}

export default UserPanel;