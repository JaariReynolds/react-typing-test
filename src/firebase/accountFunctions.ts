import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut as logOut } from "firebase/auth";

const authErrorMessageUserFriendly = (errorCode: string) => {
	return String(errorCode).substring(5).replaceAll("-", " ");
};

export const signUp = (email: string, password: string): Promise<string> => {
	return createUserWithEmailAndPassword(auth, email, password)
		.then(() => {
			return "";
		}).catch(error => {
			return authErrorMessageUserFriendly(error.code);
		});
};

export const signIn = (email: string, password: string): Promise<string> => {
	return signInWithEmailAndPassword(auth, email, password)
		.then(() => {
			return "";
		}).catch((error) => {
			return authErrorMessageUserFriendly(error.code);
		});	
};

export const signOut = () => {
	return logOut(auth)
		.then(() => {
			return "";
		}).catch((error) => {
			console.log("error signing out");
			console.log(error);
		});
};

export const updateDisplayName = (displayName: string) => {
	if (!auth.currentUser) return;

	updateProfile(auth.currentUser, {
		displayName: displayName
	}).then(() => {
		console.log("display name updated");
	}).catch((error) => {
		console.log("couldn't update display name");
		console.log(error);
	});
};


