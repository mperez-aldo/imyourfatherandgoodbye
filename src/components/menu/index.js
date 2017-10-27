import React, { Component } from 'react';

class Menu extends Component {
	render(){
		return (<div className="menu">
					<ul>
						<li>Generate category mapping</li>
						<li>Generate translation URLs</li>
						<li>Compare environment paths</li>
					</ul>
				</div>);
	}
}

export default Menu;