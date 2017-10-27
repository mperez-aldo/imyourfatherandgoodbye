import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyA8v1Jjs4Zeg_pKcUnbrNfoC1cUr5PLaZ4",
    authDomain: "mperez-dev.firebaseapp.com",
    databaseURL: "https://mperez-dev.firebaseio.com",
    projectId: "mperez-dev",
    storageBucket: "mperez-dev.appspot.com",
    messagingSenderId: "1039304300320"
};
firebase.initializeApp(config);

/*const config = {
    apiKey: "AIzaSyC_RG7TkYFWLSRCqqurJHkRmzn1ifnGXog",
    authDomain: "nirvana-dev.firebaseapp.com",
    databaseURL: "https://nirvana-dev.firebaseio.com",
    storageBucket: "nirvana-dev.appspot.com",
    projectId: "nirvana-dev",
    messagingSenderId: "350797490168"
  };
firebase.initializeApp(config);
*/

export default firebase;