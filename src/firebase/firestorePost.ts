import { database } from "./firebase";
import { addDoc, collection, doc, getDocs, limit, query, setDoc, updateDoc, where } from "firebase/firestore";
import { TimedScoreDocument, UserDocument, WordCountScoreDocument } from "./firestoreDocumentInterfaces";
import { TestWords } from "../interfaces/WordStructure";
import { TestType } from "../App";
import { timedHighScoresCollectionRef, wordCountHighScoresCollectionRef } from "./firestoreConstants";

export const createUserDocument = async (userId: string, email: string, username: string) => {
	const newUserDocument = doc(database, "users", userId);
	const newUserObject: UserDocument = {
		email: email,
		username: username,
		testSummaries: [],
		creationDate: new Date(),
	};

	try {
		await setDoc(newUserDocument, newUserObject);
	} catch (error) {
		console.error(error);
	}
};

export const createScoreDocument = async (username: string, scoreObject: TestWords) => {
	switch (scoreObject.testType) {
	case TestType.Time:
		await createTimedScoreDocument(username, scoreObject);
		console.log("timed score document created!");
		break;
	case TestType.Words:
		await createWordCountScoreDocument(username, scoreObject);
		console.log("word count score document created!");
		break;
	}
};

const createTimedScoreDocument = async (username: string, scoreObject: TestWords) => {
	const timedScoresCollectionRef = collection(database, "timedScores");
	const newTimedScoreObject: TimedScoreDocument = {
		username: username,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		submissionDate: new Date()
	};

	try {
		await addDoc(timedScoresCollectionRef, newTimedScoreObject);
		await updateTimedHighScoreDocument(username, newTimedScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const createWordCountScoreDocument = async (username: string, scoreObject: TestWords) => {
	const wordCountScoresCollectionRef = collection(database, "wordCountScores");
	const newWordCountScoreObject: WordCountScoreDocument = {
		username: username,
		wordCount: scoreObject.words.length,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		submissionDate: new Date()
	};

	try {
		await addDoc(wordCountScoresCollectionRef, newWordCountScoreObject);
		await updateWordCountHighScoreDocument(username, newWordCountScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const updateTimedHighScoreDocument = async (username: string, timedScoreObject: TimedScoreDocument) => {
	try {
		const highScoreQuery = query(
			timedHighScoresCollectionRef, 
			where("username", "==", username), 
			where("testLengthMilliseconds", "==", timedScoreObject.testLengthMilliseconds), limit(1));

		const data = await getDocs(highScoreQuery);
	
		// create new highscore document for user if needed
		if (data.empty) {
			await addDoc(timedHighScoresCollectionRef, timedScoreObject);
			console.log("wordcount highscore doc created!");
			return;
		}

		// check if user has beaten their highscore 
		const currentHighScoreDocument = data.docs[0].data() as TimedScoreDocument;
		if (currentHighScoreDocument.wpm > timedScoreObject.wpm) {
			console.log("highscore not beaten, no changes made to collection");
			return;
		}

		// if beaten, update document
		const docRef = doc(database, "timedHighScores", data.docs[0].id);
		await updateDoc(docRef, {
			wpm: timedScoreObject.wpm,
			accuracy: timedScoreObject.accuracy,
			submissionDate: timedScoreObject.submissionDate
		});

		console.log("highscore updated!");

	} catch (error) {
		console.error(error);
	}
};

const updateWordCountHighScoreDocument = async (username: string, wordCountScoreObject: WordCountScoreDocument) => {
	try {
		const highScoreQuery = query(
			wordCountHighScoresCollectionRef, 
			where("username", "==", username), 
			where("wordCount", "==", wordCountScoreObject.wordCount), limit(1));

		const data = await getDocs(highScoreQuery);
	
		// create new highscore document for user if needed
		if (data.empty) {
			await addDoc(wordCountHighScoresCollectionRef, wordCountScoreObject);
			console.log("wordcount highscore doc created!");
			return;
		}

		// check if user has beaten their highscore 
		const currentHighScoreDocument = data.docs[0].data() as WordCountScoreDocument;
		if (currentHighScoreDocument.wpm > wordCountScoreObject.wpm) {
			console.log("highscore not beaten, no changes made to collection");
			return;
		}

		// if beaten, update document
		const docRef = doc(database, "wordCountHighScores", data.docs[0].id);
		await updateDoc(docRef, {
			wpm: wordCountScoreObject.wpm,
			accuracy: wordCountScoreObject.accuracy,
			submissionDate: wordCountScoreObject.submissionDate
		});

		console.log("highscore updated!");

	} catch (error) {
		console.error(error);
	}
};
