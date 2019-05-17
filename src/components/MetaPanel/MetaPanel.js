import React from "react";
import mamoru from "./img/mamoru.gif";

class MetaPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contributors: [
        {title: "This is contributor 1"},
        {title: "This is contributor 2"},
        {title: "This is contributor 3"},
        {title: "This is contributor 4"},
        {title: "This is contributor 5"},
        {title: "This is contributor 6"},
        {title: "This is contributor 7"},
        {title: "This is contributor 8"}
      ]
    }
  }

  render() {
    return (
      <div style={{borderRightWidth: 5, borderRightColor: '#99989c'}}>
        <img src={mamoru} width="300" height="300"/>
        <p style={{paddingLeft: 20, color: "#49525d"}}> Contributors</p>
        <ol>
          {this.state.contributors.map((item) => (
            <li style={styles.item}> {item.title} </li>)
          )}
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
