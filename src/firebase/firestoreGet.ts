import { database } from "./firebase";
import { DocumentData, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { timedScoresCollectionRef, usersCollectionRef, wordCountScoresCollectionRef } from "./firestoreConstants";
import { TestType } from "../App";
import { TimedScoreDocument, WordCountScoreDocument } from "./firestoreDocumentInterfaces";

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

// gets the top 10 highscores for the respective test type and test length
export const getHighScores = async (testType: TestType, testLength: number): Promise<TimedScoreDocument[] | WordCountScoreDocument[]> => {
	switch (testType) {
	case TestType.Time:
		return getHighScoresForTimedTest(testLength);
	case TestType.Words:
		return getHighScoresForWordCountTest(testLength);
	}
};

const getHighScoresForWordCountTest = async (wordCount: number) => {
	try {
		const highScoresQuery = query(wordCountScoresCollectionRef, where("wordCount", "==", wordCount), orderBy("wpm", "desc"), limit(10));
		const data = await getDocs(highScoresQuery);

		if (data.empty)
			throw new Error("unable to retrieve highscores");

		const wordCountScoreDocumentArray: WordCountScoreDocument[] = [];
		data.forEach((doc) => {
			wordCountScoreDocumentArray.push(doc.data() as WordCountScoreDocument);
		});

		return wordCountScoreDocumentArray;
	} catch (error) {
		console.error(error);
		return [];
	}
};

const getHighScoresForTimedTest = async (testLengthMilliseconds: number) => {
	try {
		const highScoresQuery = query(timedScoresCollectionRef, where("testLengthMilliseconds", "==", testLengthMilliseconds), orderBy("wpm", "desc"), limit(10));
		const data = await getDocs(highScoresQuery);

		if (data.empty)
			throw new Error("unable to retrieve highscores");

		const timeScoreDocumentArray: TimedScoreDocument[] = [];
		data.forEach((doc) => {
			timeScoreDocumentArray.push(doc.data() as TimedScoreDocument);
		});

		return timeScoreDocumentArray;		
	} catch (error) {
		console.error(error);
		return [];
	}
};


