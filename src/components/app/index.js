import React, { Component } from 'react';

import Header from '../header';
import Menu from '../menu';
import WorkingArea from '../working_area';
import firebase from '../../firebase.js';

class App extends Component {  
	constructor(props) {
		super();
        this.state = {
        	user: null,
            loggedIn : false,
            email : '',
            password : '',
            errorCode : '',
            errorMessage : ''
        };
        this.checkAuthStatus = this.checkAuthStatus.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        firebase.auth().signOut();
    }
    handleChange = (event) => {
	  this.setState({[event.target.name] : event.target.value});
	}
	/* Logs the user in FB */
	handleLogIn = (event) => {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.catch(function(error) {
				// ERROR HANDLING
				this.setState({errorCode : error.code, errorMessage : error.message, loggedIn: false, user : null});
			}.bind(this)) 
			.then(function(){
				this.checkAuthStatus();
			}.bind(this));
	}
	/* Updates the status of the session */ 
	handleLogOut = (event) =>  {
		event.preventDefault();
	    firebase.auth().signOut().then(function(){
	    	this.checkAuthStatus();
	    	this.setState({loggedIn : false});
	    	console.log("user logged out");
	    }.bind(this));	    
	}
	/* FB auth state change */
	checkAuthStatus(){
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				this.setState({loggedIn: true, user : user, errorCode : '', errorMessage : ''});
				console.log("user logged in");
		  	} else {
		    	this.setState({loggedIn: false, user : null});
		  	}
		}.bind(this));
	}
	render(){
		if ( (this.state.loggedIn === true) || (this.state.user) ){
			return(
				<div className="main_container">
					<Header handleLogOut={this.handleLogOut}>
					</Header>
					<div className="content">
						<div className="cols col-1-1">
							<Menu></Menu>
						</div>
						<div className="cols col-2-1">
							<WorkingArea firebase={firebase}></WorkingArea>
						</div>
					</div>
				</div>);
		}else{
			return (
		        <div className="login_wrapper">
			        <div className="login_box">
			        	<h1>Member Login</h1>
			        	<div className="login_fields">
			        		<form className="login_form" onSubmit={this.handleLogIn.bind(this)}>
				            	<input type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)}/>
				            	<input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)}/>
				            	<input value="Login" type="submit"/>
				            </form>
			          	</div>
			        </div>
					<label>{this.state.errorMessage}</label>
		        </div>
		    );
		}
	}
}

export default App;

//onClick={ this.handleLogIn.bind(this) }