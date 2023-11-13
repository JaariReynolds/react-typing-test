import { Timestamp, addDoc, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { TestInformation } from "../../interfaces/WordStructure";
import { database } from "../firebase";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { TIMED_LEADERBOARD, WORDCOUNT_LEADERBOARD, timedLeaderboardCollectionRef, timedScoresCollectionRef, wordCountLeaderboardCollectionRef, wordCountScoresCollectionRef } from "../firestoreConstants";
import { TestMode, TestType } from "../../enums";

export const createScoreDocument = async (username: string, scoreObject: TestInformation) => {
	// extra check just in case
	if (scoreObject.testMode !== TestMode.Standard) {
		console.error("unable to submit funbox mode score to standard score collection");
		return;
	}

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
	const newTimedScoreObject: TimedScoreDocument = {
		username: username,
		testType: scoreObject.testType.toString(),
		testLengthSeconds: scoreObject.timeElapsedMilliSeconds / 1000,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: Timestamp.now()
	};

	// add score document, then check if leaderboard document needs to be overwritten
	try {
		await addDoc(timedScoresCollectionRef, newTimedScoreObject);
		await updateTimedLeaderboardDocument(username, newTimedScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const createWordCountScoreDocument = async (username: string, scoreObject: TestInformation) => {
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

	// add score document, then check if leaderboard document needs to be overwritten
	try {
		await addDoc(wordCountScoresCollectionRef, newWordCountScoreObject);
		await updateWordCountLeaderboardDocument(username, newWordCountScoreObject);
	} catch (error) {
		console.error(error);
	}
};

const updateTimedLeaderboardDocument = async (username: string, timedScoreObject: TimedScoreDocument) => {
	try {
		const leaderboardQuery = query(
			timedLeaderboardCollectionRef, 
			where("username", "==", username), 
			where("testLengthSeconds", "==", timedScoreObject.testLengthSeconds), limit(1));

		const data = await getDocs(leaderboardQuery);
	
		// create new leaderboard document for user if needed
		if (data.empty) {
			await addDoc(timedLeaderboardCollectionRef, timedScoreObject);
			return;
		}

		// check if user has beaten their highscore 
		const currentLeaderboardDocument = data.docs[0].data() as TimedScoreDocument;
		if (currentLeaderboardDocument.wpm > timedScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, TIMED_LEADERBOARD, data.docs[0].id);
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

const updateWordCountLeaderboardDocument = async (username: string, wordCountScoreObject: WordCountScoreDocument) => {
	try {
		const leaderboardQuery = query(
			wordCountLeaderboardCollectionRef, 
			where("username", "==", username), 
			where("wordCount", "==", wordCountScoreObject.wordCount), limit(1));

		const data = await getDocs(leaderboardQuery);
	
		// create new leaderboard document for user if needed
		if (data.empty) {
			await addDoc(wordCountLeaderboardCollectionRef, wordCountScoreObject);
			return;
		}

		// check if user has beaten their highscore 
		const currentLeaderboardDocument = data.docs[0].data() as WordCountScoreDocument;
		if (currentLeaderboardDocument.wpm > wordCountScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, WORDCOUNT_LEADERBOARD, data.docs[0].id);
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

