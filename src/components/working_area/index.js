import React, { Component } from 'react';
import Job from '../job';

class WorkingArea extends Component {
	constructor(props) {
		super();
        this.state = {
        };
    }
	render(){
		return (<div className="working_area">
					<Job firebase={this.props.firebase}></Job>
				</div>);
	}
}
export default WorkingArea;