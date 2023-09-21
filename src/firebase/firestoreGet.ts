import { database } from "./firebase";
import { DocumentData, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { usersCollectionRef } from "./firestoreConstants";

export const getAllUsers = async () => {
	try {
		const data = await getDocs(usersCollectionRef);

		if (data.empty) 
			throw new Error("collection is empty or does not exist");
        
		data.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
		});
	} catch (error) {
		console.error(error);
	}
};

export const getUserFromUserId = async (userId: string): Promise<DocumentData|null> => {
	try {
		const documentRef = doc(database, "users", userId);
		const data = await getDoc(documentRef);

		if (!data.exists()) {
			throw new Error(`document with ID '${userId}' does not exist in collection 'users'`);
		}

		return (data.data());
	} catch (error) {
		console.log("error in getUserFromUserId");
		throw error;
	}
};

// get user based on email
export const getUser = async (email: string) => {
	try {       
		const userQuery = query(usersCollectionRef, where("email", "==", email)); 
		const data = await getDocs(userQuery);

		if (data.empty) 
			throw new Error(`document with email '${email}' does not exist`);

		console.log(data.docs[0].id, " => ", data.docs[0].data());
	} catch (error) {
		console.error(error);
	}
};

export const getDocumentFromProvidedCollection = async (uniqueDocumentId: string, collectionName: string) => {
	try {
		const data = await getDoc(doc(database, collectionName, uniqueDocumentId));

		if (!data.exists()) 
			throw new Error(`document with ID '${uniqueDocumentId}' does not exist in collection '${collectionName}'`);

		console.log(data.data());
	} catch (error) {
		console.error(error);
	}
};

export const isUsernameAvailable = async (username: string): Promise<boolean> => {
	try {
		const userQuery = query(usersCollectionRef, where("username", "==", username));
		const data = await getDocs(userQuery);
		
		if (data.empty)
			return true;
		else 
			return false;
		
	} catch (error) {
		console.error(error);
		return false;
	}
};


