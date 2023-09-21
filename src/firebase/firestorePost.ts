import { database } from "./firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { TimedScoreDocument, UserDocument, WordCountScoreDocument } from "./firestoreDocumentInterfaces";
import { TestWords } from "../interfaces/WordStructure";
import { TestType } from "../App";

export const createUserDocument = async (userId: string, email: string, username: string, selectedPaletteId: number) => {
	const newUserDocument = doc(database, "users", userId);
	const newUserObject: UserDocument = {
		email: email,
		username: username,
		selectedPaletteIndex: selectedPaletteId,
		testSummaries: [],
		creationDate: new Date(),
	};

	try {
		await setDoc(newUserDocument, newUserObject);
	} catch (error) {
		console.error(error);
	}
};

export const createScoreDocument = async (userId: string, scoreObject: TestWords) => {
	switch (scoreObject.testType) {
	case TestType.Time:
		await createTimedScoreDocument(userId, scoreObject);
		console.log("timed score document created!");
		break;
	case TestType.Words:
		await createWordCountScoreDocument(userId, scoreObject);
		console.log("word count score document created!");
		break;
	}
};

const createTimedScoreDocument = async (userId: string, scoreObject: TestWords) => {
	const timedScoresCollectionRef = collection(database, "timedScores");
	const newTimedScoreObject: TimedScoreDocument = {
		userId: userId,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		submissionDate: new Date()
	};

	try {
		await addDoc(timedScoresCollectionRef, newTimedScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const createWordCountScoreDocument = async (userId: string, scoreObject: TestWords) => {
	const wordCountScoresCollectionRef = collection(database, "wordCountScores");
	const newWordCountScoreObject: WordCountScoreDocument = {
		userId: userId,
		wordCount: scoreObject.words.length,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		submissionDate: new Date()
	};

	try {
		await addDoc(wordCountScoresCollectionRef, newWordCountScoreObject);
	} catch (error) {
		console.error(error);
	}
};
