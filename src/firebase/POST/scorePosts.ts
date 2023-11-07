import { Timestamp, addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { TestInformation } from "../../interfaces/WordStructure";
import { database } from "../firebase";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { timedHighScoresCollectionRef, wordCountHighScoresCollectionRef } from "../firestoreConstants";
import { TestType } from "../../enums";

export const createScoreDocument = async (username: string, scoreObject: TestInformation) => {
	switch (scoreObject.testType) {
	case TestType.Time:
		await createTimedScoreDocument(username, scoreObject);
		//console.log("timed score document created!");
		break;
	case TestType.Words:
		await createWordCountScoreDocument(username, scoreObject);
		//console.log("word count score document created!");
		break;
	}
};

const createTimedScoreDocument = async (username: string, scoreObject: TestInformation) => {
	const timedScoresCollectionRef = collection(database, "timedScores");
	const newTimedScoreObject: TimedScoreDocument = {
		username: username,
		testType: scoreObject.testType.toString(),
		testLengthSeconds: scoreObject.timeElapsedMilliSeconds / 1000,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: Timestamp.now()
	};

	// add score document, then check if highscore document needs to be overwritten
	try {
		await addDoc(timedScoresCollectionRef, newTimedScoreObject);
		await updateTimedHighScoreDocument(username, newTimedScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const createWordCountScoreDocument = async (username: string, scoreObject: TestInformation) => {
	const wordCountScoresCollectionRef = collection(database, "wordCountScores");
	const newWordCountScoreObject: WordCountScoreDocument = {
		username: username,
		testType: scoreObject.testType.toString(),
		wordCount: scoreObject.words.length,
		testLengthSeconds: scoreObject.timeElapsedMilliSeconds / 1000,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: Timestamp.now()
	};

	// add score document, then check if highscore document needs to be overwritten
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
			where("testLengthSeconds", "==", timedScoreObject.testLengthSeconds), limit(1));

		const data = await getDocs(highScoreQuery);
	
		// create new highscore document for user if needed
		if (data.empty) {
			await addDoc(timedHighScoresCollectionRef, timedScoreObject);
			return;
		}

		// check if user has beaten their highscore 
		const currentHighScoreDocument = data.docs[0].data() as TimedScoreDocument;
		if (currentHighScoreDocument.wpm > timedScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, "timedHighScores", data.docs[0].id);
		await updateDoc(docRef, {
			wpm: timedScoreObject.wpm,
			accuracy: timedScoreObject.accuracy,
			consistency: timedScoreObject.consistency,
			submissionDate: timedScoreObject.submissionDate
		});

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
			return;
		}

		// check if user has beaten their highscore 
		const currentHighScoreDocument = data.docs[0].data() as WordCountScoreDocument;
		if (currentHighScoreDocument.wpm > wordCountScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, "wordCountHighScores", data.docs[0].id);
		await updateDoc(docRef, {
			wpm: wordCountScoreObject.wpm,
			accuracy: wordCountScoreObject.accuracy,
			consistency: wordCountScoreObject.consistency,
			submissionDate: wordCountScoreObject.submissionDate
		});

	} catch (error) {
		console.error(error);
	}
};

