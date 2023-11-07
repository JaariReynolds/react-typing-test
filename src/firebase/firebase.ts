import {FirebaseApp, initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app: FirebaseApp;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	console.log("development app");
	app = initializeApp({ 
		apiKey: process.env.REACT_APP_DEVELOPMENT_FIREBASE_API_KEY,
		authDomain: process.env.REACT_APP_DEVELOPMENT_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.REACT_APP_DEVELOPMENT_FIREBASE_PROJECT_ID,
		storageBucket: process.env.REACT_APP_DEVELOPMENT_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.REACT_APP_DEVELOPMENT_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.REACT_APP_DEVELOPMENT_FIREBASE_APP_ID,
	});
} else {
	console.log("production app");
	app = initializeApp({ 
		apiKey: process.env.REACT_APP_PRODUCTION_FIREBASE_API_KEY,
		authDomain: process.env.REACT_APP_PRODUCTION_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.REACT_APP_PRODUCTION_FIREBASE_PROJECT_ID,
		storageBucket: process.env.REACT_APP_PRODUCTION_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.REACT_APP_PRODUCTION_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.REACT_APP_PRODUCTION_FIREBASE_APP_ID,
	});
}

export const auth = getAuth(app);
export const database = getFirestore(app);

export default app;