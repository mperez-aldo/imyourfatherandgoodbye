import 'whatwg-fetch';
const composerURL = "https://uat-comp.aldoshoes.com/api/categories";
const firebasePath = "jobs";

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  } 
}
function parseJSON(response) {
  return response.json();
}

export function executeJOB(firebase, targetArea, brand, country, language){
	console.log("Request = " + brand + "-" + country + '-' + language);
	fetch(composerURL, {
	  method: 'GET',
	  headers: {
	    'x-aldo-region': country,
	    'x-aldo-lang' : language,
	    'Access-Control-Allow-Origin': '*'
	  }
	})	
	.then(checkStatus)
	.then(parseJSON)
  	.then(function(data) {
    	console.log('Request succeeded with JSON response');
		// Create a new job and add the data
		var ref = firebase.database().ref(firebasePath);
		var job = ref.push({'date' : 'now', 'type': 'more'});
		for (let [key, value] of Object.entries(data)){
			job.child("category-mapping").push({'url': '/' + key , 'categoryID' : value.categoryId, 'title' : value.title});
			//targetArea
		}
  	}).catch(function(error) {
     	console.log('request failed', error);
	});
}