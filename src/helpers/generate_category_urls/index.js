import 'whatwg-fetch';
var firebase = null;
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
/* Gets the category mapping from Composer */
function getCategoryMapping(destinationCountry, destinationLanguage){
	return new Promise(function(resolve, reject) {
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
			console.log('Composer API call succeeded');
			resolve(data);
	  	})
	  	.catch(function(error) {
     		console.log('Composer request failed', error);
     		reject(error);
		});
	});
}

/* Creates the category mapping as a child element of the job */
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
				jobRef.child(categoryMappingPath).push({'url_destination' : '/' + key , 
													   'url_source' : "/" + responseData[sourceStoreFront],
													   'categoryID' : value.categoryId,
													   'title' : value.title })
				.then(function(snapshot){
					resolve(responseData);
			    });
		  	})
			.catch(function(error) {
	 			console.log('request failed', error);
	 			reject(error);
			});
		}));
	}
	return promises;
}
/* Copies the path from the corresponding store front inside of the job path */
function generatePaths(jobRef, brand, country, language){
	var promises = [];
	var sourceRef;
	try{
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
		return promises;
	}catch(error) {
 		console.log('Container paths generation failed', error);
	}
}


/* URL replacement */
/* Updates the path node URL with the value found in the mapping */ 
function translateNodeURL(resolve, reject, jobId, objectRef, sourceURL, sourceAttr){
	var pathRef = firebase.database().ref("/jobs/" + jobId + "/" + categoryMappingPath).orderByChild("url_source")
				  .equalTo(sourceURL).limitToLast(1);
	pathRef.once("value", function(querySnapshot) {
		if(querySnapshot.val() != null){
        	console.log("Exito - " + sourceURL + " - " + sourceAttr + " - " + JSON.stringify(querySnapshot.val()) + "");
        	objectRef.update({[sourceAttr] : querySnapshot["url_destination"] });
        }
        resolve(querySnapshot);
    })
    .catch(function(error) {
 		console.log('Node URL update failed ', error);
 		reject(error);
	});
}
/* Recursive search within the objects and attributes */
function recursiveURLReplace(resolve, reject, objectSource, parentObjectRef, jobId, promises) {
    if (typeof objectSource === 'string') {
		resolve(null);
    }
    if (typeof objectSource === 'object') {
        if (objectSource === null) {
            resolve(null);
        }
        Object.keys(objectSource).forEach(function (property) {
			if( (property === "url") || (property === "link") ){
				promises.push(new Promise(function(resolve, reject) {
					translateNodeURL(resolve, reject, jobId, objectSource, objectSource[property], property);
				}));
			}
			promises.push(new Promise(function(resolve, reject) {
            	objectSource[property] = recursiveURLReplace(resolve, reject, objectSource[property], objectSource, 
            												 jobId, promises);
            }));
        });
    }
}
/* Recursively translate all child URLs and Links */
function translatePaths(jobRef, jobId){
	var promises = [];
	var pathRef;
	try{
		sourcePaths.forEach(function(value){
			promises.push(new Promise(function(resolve, reject) {
				pathRef = jobRef.child(value);
				pathRef.on("value", function(querySnapshot) {
			    	recursiveURLReplace(resolve, reject, querySnapshot.val(), querySnapshot, jobId, promises);
		  		});
			}));
		});
  		return promises;
	}catch(error) {
 		console.log('Path URLs translation failed', error);
	}
}


/* Main JOB function */
export function executeJOB(firebaseConn, targetArea, brand, sourceStoreFront, destinationStoreFront){
	firebase = firebaseConn;
	var sourceCountry = sourceStoreFront.substring(0,2);
	var destinationCountry = destinationStoreFront.substring(0,2);
	var sourceLanguage = sourceStoreFront.substring(sourceStoreFront.indexOf("/") + 1,sourceStoreFront.length);
	var destinationLanguage = destinationStoreFront.substring(destinationStoreFront.indexOf("/") + 1,destinationStoreFront.length);
	console.log("Country = " + destinationCountry + " Language = " + destinationLanguage);
	// Creates a new job and adds the data inside    	
	var jobRef = firebase.database().ref(jobsPath);
	jobRef.push({'date' : new Date().toLocaleDateString(), 'type': 'generate_category_urls'})
	.then(function(snapshot){
		// Gets the category mapping from Composer for the destination Store front
		getCategoryMapping(destinationCountry,destinationLanguage)
		.then(function(composerData){
			// Creates the category mapping node inside of the job
			var promisesC = generateCategoryMapping(snapshot,composerData,sourceCountry,sourceLanguage,sourceStoreFront);
			Promise.all(promisesC)
			.then(function(){
				// Creates all the firebase paths containing URLs, inside of the job
				var promisesP = generatePaths(snapshot, brand, destinationCountry, destinationLanguage);
				Promise.all(promisesP)
				.then(function(){
					// Recursively updates the paths to translate the URLs	
					var promisesT = translatePaths(snapshot, "" + snapshot.key);
					Promise.all(promisesT)
					.then(function(){

						console.log("Job ended");
					});
				});
   			});
		});
  	})
	.catch(function(error) {
 		console.log('General error ', error);
	});
}