import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut as logOut } from "firebase/auth";
import { createUserDocument } from "./firestorePost";

const authErrorMessageUserFriendly = (errorCode: string) => {
	return String(errorCode).substring(5).replaceAll("-", " ");
};

// creates auth user, then creates a corresponding user document
export const signUp = (email: string, password: string, username: string): Promise<string> => {
	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			createUserDocument(userCredential.user.uid, email, username)
				.then(() => {
					console.log("successfully created user document!");
				}).catch((error) => {
					console.error(error);
					return "an error has occured somehwere";
				});
			
			return "";
		}).catch(error => {
			return authErrorMessageUserFriendly(error.code);
		});
};

export const signIn = (email: string, password: string): Promise<string> => {
	return signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			console.log(userCredential);
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


