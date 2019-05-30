import React from "react"
import {Header, Icon, Input, Segment} from "semantic-ui-react"

class MessagesHeader extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div style={{background: null}}>
        {/* channel title */}
        <Header fluid="true" as="h2" floated="left" style={{marginBottom: 0}}>
          <span>
            {this.props.channel ? `# ${this.props.channel.name}` : ''}
          </span>
          {/*<Header.Subheader>
            <Icon size={'small'} name={"star outline"} color="grey"/>
            <span style={styles.subheaderSpan}>|</span>
            <Icon size={'small'} name={"user outline"} color="grey"/>
            <span style={styles.subheaderText}>2</span>
            <span style={styles.subheaderSpan}>|</span>
            <Icon size={'small'} name={"pin"} color="grey"/>
            <span style={styles.subheaderText}>28</span>
          </Header.Subheader>*/}
        </Header>

        {/* channel search input */}
        <Header as="h5" floated="right">
          {/*<Icon style={styles.rightHeaderIcon} size={'tiny'} name={"call"} color="grey"/>
          <Icon style={styles.rightHeaderIcon} size={'tiny'} name={"info circle"} color="grey"/>
          <Icon style={styles.rightHeaderIcon} size={'tiny'} name={"setting"} color="grey"/>
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="search Messages"
          />
          <Icon style={styles.rightHeaderIcon} size={'tiny'} name={"at"} color="grey"/>
          <Icon style={styles.rightHeaderIcon} size={'tiny'} name={"star outline"} color="grey"/>*/}
        </Header>
      </div>
    )
  }
}

const styles = {
  subheaderSpan: {
    color: 'grey',
    fontSize: 12,
    marginLeft: 5,
    marginRight: 9
  },
  subheaderText: {
    color: 'grey',
    fontSize: 12,
  },
  rightHeaderIcon: {
    paddingRight: 3,
    paddingLeft: 3
  }
}
export default MessagesHeader
