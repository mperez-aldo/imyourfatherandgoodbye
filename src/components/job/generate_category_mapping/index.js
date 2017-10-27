import React, { Component } from 'react';
import {executeJOB} from '../../../helpers/generate_category_mapping';

const brands = ["aldo","cis","globo"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});
const countries = ["ca","us","uk","eu"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});
const languages = ["en","fr","en_US","en_UK","en_EU","de_EU"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});

class GenerateCategoryMappingJob extends Component {

	constructor(props) {
		super();
        this.state = {
            brand : brands[0].key,
            country : countries[0].key,
            language : languages[0].key,
            results : null
        };

		
    }

	handleChange = (event) => {
	  this.setState({[event.target.name] : event.target.value});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		try{
			executeJOB(this.props.firebase,this.state.results,this.state.brand,this.state.country,this.state.language);
		}catch(e){
			console.log(e);
		}
	}

	render(){
		return (<div>
					<div className="job_form">
						<form onSubmit={this.handleSubmit.bind(this)}>
							<label>Brand</label>
							<select name="brand" onChange={this.handleChange.bind(this)} value={this.state.brand}>
								{brands}
							</select>
							<label>Country</label>
							<select name="country" onChange={this.handleChange.bind(this)} value={this.state.country}>
								{countries}
							</select>
							<label>Language</label>
							<select name="language" onChange={this.handleChange.bind(this)} value={this.state.language}>
								{languages}
							</select>
							<input type="submit" value="Send"/>
						</form>
					</div>
					<div className="job_results">
						{ this.state.results }
					</div>
				</div>
				);
	}
}

export default GenerateCategoryMappingJob;