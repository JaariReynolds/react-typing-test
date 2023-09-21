import { database } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { UserDocument } from "./firestoreDocumentInterfaces";

export const createUserDocument = async (userId: string, email: string, username: string, selectedPaletteId: number) => {
	const newUserDocument = doc(database, "users", userId);
	const newUserObject: UserDocument = {
		email: email,
		username: username,
		creationDate: new Date(),
		selectedPaletteIndex: selectedPaletteId,
		testSummaries: []
	};

	try {
		await setDoc(newUserDocument, newUserObject);
	} catch (error) {
		console.log(error);
	}
};