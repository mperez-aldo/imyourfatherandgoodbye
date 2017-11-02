import React, { Component } from 'react';
import {executeJOB} from '../../../helpers/generate_category_urls';

const brands = ["aldo"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});
const sourceStoreFronts = ["eu/en_EU"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});
const destinationStoreFronts = ["eu/de_EU"].map(
	function (i){
		return (<option value={ i } key={i}>{ i }</option>);
  	});

class GenerateCategoryURLJob extends Component {
	constructor(props) {
		super();
        this.state = {
            brand : brands[0].key,
            sourceStoreFront : sourceStoreFronts[0].key,
            destinationStoreFront : destinationStoreFronts[0].key,
            results : null
        };

		
    }
	handleChange = (event) => {
	  this.setState({[event.target.name] : event.target.value});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		try{
			executeJOB(this.props.firebase,this.state.results,this.state.brand,
					   this.state.sourceStoreFront,this.state.destinationStoreFront);
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
							<label>Source Store front</label>
							<select name="sourceStoreFront" onChange={this.handleChange.bind(this)} value={this.state.sourceStoreFront}>
								{sourceStoreFronts}
							</select>
							<label>Destination Store front</label>
							<select name="destinationStoreFront" onChange={this.handleChange.bind(this)} value={this.state.destinationStoreFront}>
								{destinationStoreFronts}
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

export default GenerateCategoryURLJob;