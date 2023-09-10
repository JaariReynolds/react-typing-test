import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signUp = (email: string, password: string) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			console.log("you just signed up!");
			console.log(userCredential);
		}).catch(error => {
			console.log(error);
		});
};

export const signIn = (email: string, password: string) => {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			console.log("you just signed in!");
			console.log(userCredential);
		}).catch(error => {
			console.log(error);
		});
};

export const logout = () => {
	signOut(auth)
		.then(() => {
			console.log("signed out");
		}).catch((error) => {
			console.log("error signing out");
			console.log(error);
		});
};


