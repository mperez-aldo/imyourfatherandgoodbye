import 'whatwg-fetch';
const composerURL = "https://uat-comp.aldoshoes.com/api/categories";
const jobsPath = "jobs";
const categoryMappingPath = "category-mapping";
const sourcePaths = ["header-tree","menu-tree","content-tree","footer-tree"];
					 //"promotional-messages","content_modules","stories"];
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
/* Gets the category mapping from composer and creates a child element of the job */
function generateCategoryMapping(jobRef, data, sourceCountry, sourceLanguage, sourceStoreFront){
	var promises = [];
	for (let [key, value] of Object.entries(data)){
		promises.push(new Promise(function(resolve, reject) {
			fetch(composerURL + "/" + value.categoryId, {
			  method: 'GET',
			  headers: {
			    'x-aldo-region': sourceCountry,
			    'x-aldo-lang' : sourceLanguage,
			    'Access-Control-Allow-Origin': '*'
			  }
			})
			.then(checkStatus)
			.then(parseJSON)
		  	.then(function(responseData) { 
				// Add both urls to the category
				promises.push(new Promise(function(resolve, reject) { 
					jobRef.child(categoryMappingPath).push({'url_destination' : '/' + key , 
														   'url_source' : "/" + responseData[sourceStoreFront],
														   'categoryID' : value.categoryId,
														   'title' : value.title })
					.then(function(snapshot){
						resolve(snapshot.val());
				    });
				}));
				resolve(responseData);
		  	})
			.catch(function(error) {
	 			console.log('request failed', error);
	 			reject(error);
			});
		}));
	}
	Promise.all(promises)
	.then(data => {
		console.log("Category mapping generation completed", data);
	});
}
/* Copies the path from the corresponding store front inside of the job path */
function generatePaths(firebase, jobRef, brand, country, language){
	var promises = [];
	var sourceRef;
	sourcePaths.forEach(function(value){
		promises.push(new Promise(function(resolve, reject) {
			sourceRef = firebase.database().ref(value + "/web/" + brand + "/" + country + "/" + language + "/default");
			sourceRef.once("value").then(function(snapshot) {
				jobRef.child(value).push(snapshot.val())
				.then(function(data){
					resolve(data);
				});
			});
		}));
	});
	Promise.all(promises)
	.then(data => {
		console.log("Source paths generation completed", data);
	});
}
/* Updates the path node URL with the value found in the mapping */ 
function translateNodeURL(firebase, jobId, objectRef, sourceURL, sourceAttr){
	var pathRef = firebase.database().ref("/jobs/" + jobId + "/" + categoryMappingPath).orderByChild("url_source")
				  .equalTo(sourceURL).limitToLast(1);
	pathRef.once("value", function(querySnapshot) {
		if(querySnapshot.val() != null){
        	console.log("Exito - " + sourceURL + " - " + sourceAttr + " - " + JSON.stringify(querySnapshot.val()) + "");
        }
    });
	
    //objectRef.update({[sourceAttr] : querySnapshot["url_destination"] });   
}

/* Recursive search within the objects and attributes */
function recursiveURLReplace(firebase, objectSource, parentObjectRef, jobId, promises) {
	return new Promise(function(resolve, reject) {
	    if (typeof objectSource === 'string') {
			return null;
	    }
	    if (typeof objectSource === 'object') {
	        if (objectSource === null) {
	            return null;
	        }
	        Object.keys(objectSource).forEach(function (property) {
				if( (property === "url") || (property === "link") ){
					promises.push(new Promise(function(resolve, reject) {
						translateNodeURL(firebase, jobId, objectSource, objectSource[property], property);
					}));
				}
				promises.push(new Promise(function(resolve, reject) {
	            	objectSource[property] = recursiveURLReplace(firebase,objectSource[property], objectSource, 
	            												 jobId, promises);
	            }));
	        });
	        return objectSource;
	    }
	});
}
/* Recursively translate all child URLs and Links */
function translatePaths(firebase, jobRef, jobId){
	var promises = [];
	return new Promise(function(resolve, reject) {
		var pathRef;
		sourcePaths.forEach(function(value){
			promises.push(new Promise(function(resolve, reject) {
				pathRef = jobRef.child(value);
				pathRef.on("value", function(querySnapshot) {
			    	recursiveURLReplace(firebase, querySnapshot.val(), querySnapshot, jobId, promises)
			    	.then(function(){
						resolve(querySnapshot.val());
			    	});
		  		});
			}));
		});
		Promise.all(promises)
		.then(data => {
			console.log("Paths translation completed", data);
			resolve(data);
   		});
	});
}

/* Main JOB function */
export function executeJOB(firebase, targetArea, brand, sourceStoreFront, destinationStoreFront){
	var sourceCountry = sourceStoreFront.substring(0,2);
	var destinationCountry = destinationStoreFront.substring(0,2);
	var sourceLanguage = sourceStoreFront.substring(sourceStoreFront.indexOf("/") + 1,sourceStoreFront.length);
	var destinationLanguage = destinationStoreFront.substring(destinationStoreFront.indexOf("/") + 1,destinationStoreFront.length);
	console.log("Country = " + destinationCountry + " Language = " + destinationLanguage);
	fetch(composerURL, {
	  method: 'GET',
	  headers: {
	    'x-aldo-region': destinationCountry,
	    'x-aldo-lang' : destinationLanguage,
	    'Access-Control-Allow-Origin': '*'
	  }
	})
	.then(checkStatus)
	.then(parseJSON)
  	.then(function(data) {
    	// Creates a new job and adds the data inside
    	console.log('Composer API Request succeeded with JSON response');
		var jobRef = firebase.database().ref(jobsPath);

		jobRef.push({'date' : new Date().toLocaleDateString(), 'type': 'generate_category_urls'})
		.then(function(snapshot){
			// Creates the category mapping node inside of the job
			generateCategoryMapping(snapshot,data,sourceCountry,sourceLanguage,sourceStoreFront)
			.then(function(){
				// Creates all the firebase paths containing URLs, inside of the job
				generatePaths(firebase, snapshot, brand, destinationCountry, destinationLanguage)
				.then(function(){
					// Recursively updates the paths to translate the URLs	
					translatePaths(firebase, snapshot, "" + snapshot.key);
				});
			});
		})
		.catch(function(error) {
     		console.log('General error ', error);
		});
  	})	
  	.catch(function(error) {
     	console.log('Composer request failed', error);
	});
}