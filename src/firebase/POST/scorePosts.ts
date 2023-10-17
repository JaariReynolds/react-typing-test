import { addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { TestInformation } from "../../interfaces/WordStructure";
import { database } from "../firebase";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { timedHighScoresCollectionRef, wordCountHighScoresCollectionRef } from "../firestoreConstants";
import { TestType } from "../../enums";

export const createScoreDocument = async (username: string, scoreObject: TestInformation) => {
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

const createTimedScoreDocument = async (username: string, scoreObject: TestInformation) => {
	const timedScoresCollectionRef = collection(database, "timedScores");
	const newTimedScoreObject: TimedScoreDocument = {
		username: username,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: new Date()
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
		wordCount: scoreObject.words.length,
		testLengthMilliseconds: scoreObject.timeElapsedMilliSeconds,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: new Date()
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
			where("testLengthMilliseconds", "==", timedScoreObject.testLengthMilliseconds), limit(1));

		const data = await getDocs(highScoreQuery);
	
		// create new highscore document for user if needed
		if (data.empty) {
			await addDoc(timedHighScoresCollectionRef, timedScoreObject);
			console.log("timed highscore doc created!");
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
			consistency: timedScoreObject.consistency,
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
			consistency: wordCountScoreObject.consistency,
			submissionDate: wordCountScoreObject.submissionDate
		});

		console.log("highscore updated!");

	} catch (error) {
		console.error(error);
	}
};

