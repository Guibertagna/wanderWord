// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyAldhWN1ILV_s5WB9y5BbnjewchkJw5RMo",
    authDomain: "wanderword-9e724.firebaseapp.com",
    projectId: "wanderword-9e724",
    storageBucket: "wanderword-9e724.appspot.com",
    messagingSenderId: "959820974324",
    appId: "1:959820974324:web:70e9b2022a98313332b6a1",
    measurementId: "G-CRFHMX73HF"
  }
 
  
};
const app = initializeApp(environment.firebaseConfig);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
