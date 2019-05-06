import React from "react";
import mamoru from "./img/mamoru.gif";

class MetaPanel extends React.Component {
	render() {
		return (
			<div>
				<img src={mamoru} width="500" height="500" />
				<p> Current owner: unsolved</p>
				<p> Hunters: </p>
				<ul>
					<li>User 1: 30 tokens </li>
					<li>User 2: 25 tokens </li>
					<li>User 3: 10 tokens </li>
				</ul>
			</div>
		);
	}
}

export default MetaPanel;
