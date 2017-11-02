import React, { Component } from 'react';

import GenerateCategoryURLJob from './generate_category_urls';

const categoryURLs = 1;

class Job extends Component {

	constructor(props) {
		super();
        this.state = {
            option: props.option
        };
    }

	render(){
		var view;
		switch(this.state.option){
			case categoryURLs:{
				view = <GenerateCategoryURLJob firebase={this.props.firebase}></GenerateCategoryURLJob>
				break;
			}
			default:{
				view = <GenerateCategoryURLJob firebase={this.props.firebase}></GenerateCategoryURLJob>
				break;
			}
		}
		return view;
	}
}

export default Job;