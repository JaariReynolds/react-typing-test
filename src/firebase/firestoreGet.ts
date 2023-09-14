import { database } from "./firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const usersCollectionRef = collection(database, "users");

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


