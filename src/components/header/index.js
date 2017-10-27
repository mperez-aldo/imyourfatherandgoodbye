import React, {  Component } from 'react';

class Header extends Component {
	render(){
		return (<div className="header">
					<div>
						<span>This is the header</span>
					</div>
					<div>
						<form className="logout_form" onSubmit={this.props.handleLogOut}>
							<input type="submit" value="Log Out"/>
						</form>
					</div>
				</div>);
	}
}

export default Header;