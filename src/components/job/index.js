import React, { Component } from 'react';

import GenerateCategoryMappingJob from './generate_category_mapping';
import GenerateLinksJob from './generate_links';
import ComparePathsJob from './compare_paths';

const categoryMappingOption = 1;
const generateLinksOption 	= 2;
const comparePathsOption 	= 3;

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
			case categoryMappingOption:{
				view = <GenerateCategoryMappingJob firebase={this.props.firebase}></GenerateCategoryMappingJob>
				break;
			}
			case generateLinksOption:{
				view = <GenerateLinksJob firebase={this.props.firebase}></GenerateLinksJob>
				break;
			}
			case comparePathsOption:{
				view = <ComparePathsJob firebase={this.props.firebase}></ComparePathsJob>
				break;
			}
			default:{
				view = <GenerateCategoryMappingJob firebase={this.props.firebase}></GenerateCategoryMappingJob>
				break;
			}
		}
		return view;
	}
}

export default Job;