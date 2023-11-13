import { Timestamp, addDoc, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { TestMode, TestType } from "../../enums";
import { TestInformation } from "../../interfaces/WordStructure";
import { FunboxTimedScoreDocument, FunboxWordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { FUNBOX_TIMED_LEADERBOARD, FUNBOX_WORDCOUNT_LEADERBOARD, funboxTimedLeaderboardCollectionRef, funboxWordCountLeaderboardCollectionRef } from "../firestoreConstants";
import { database } from "../firebase";

export const updateFunboxLeaderboardDocument = async (username: string, scoreObject: TestInformation) => {
	// extra check just in case
	if (scoreObject.testMode === TestMode.Standard) {
		console.error("unable to submit standard score to funbox score collection");
		return;
	}

	switch (scoreObject.testType) {
	case TestType.Time:
		await updateFunboxTimedLeaderboardDocument(username, scoreObject);
		break;
	case TestType.Words:
		await updateFunboxWordCountLeaderboardDocument(username, scoreObject);
		break;
	}
};

const updateFunboxTimedLeaderboardDocument = async (username: string, scoreObject: TestInformation) => {
	const funboxTimedScoreObject: FunboxTimedScoreDocument = {
		username: username,
		testType: scoreObject.testType.toString(),
		testMode: scoreObject.testMode.toString(),
		testLengthSeconds: scoreObject.timeElapsedMilliSeconds / 1000,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: Timestamp.now()
	};

	try {
		const leaderboardQuery = query(
			funboxTimedLeaderboardCollectionRef,
			where("username", "==", username),
			where("testLengthSeconds", "==", funboxTimedScoreObject.testLengthSeconds),
			where("testMode", "==", funboxTimedScoreObject.testMode),
			limit(1));
        
		const data = await getDocs(leaderboardQuery);

		// create new leaderboard document for user if needed
		if (data.empty) {
			await addDoc(funboxTimedLeaderboardCollectionRef, funboxTimedScoreObject);
			return;
		}

		// check if user has beaten their highscore 
		const currentLeaderboardDocument = data.docs[0].data() as FunboxTimedScoreDocument;
		if (currentLeaderboardDocument.wpm > funboxTimedScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, FUNBOX_TIMED_LEADERBOARD, data.docs[0].id);
		await updateDoc(docRef, {
			wpm: funboxTimedScoreObject.wpm,
			accuracy: funboxTimedScoreObject.accuracy,
			consistency: funboxTimedScoreObject.consistency,
			submissionDate: funboxTimedScoreObject.submissionDate
		});

	} catch (error) {
		console.error(error);
	}
};

const updateFunboxWordCountLeaderboardDocument = async (username: string, scoreObject: TestInformation) => {
	const funboxWordCountScoreObject: FunboxWordCountScoreDocument = {
		username: username,
		testType: scoreObject.testType.toString(),
		testMode: scoreObject.testMode.toString(),
		wordCount: scoreObject.words.length,
		testLengthSeconds: scoreObject.timeElapsedMilliSeconds / 1000,
		wpm: scoreObject.averageWPM,
		accuracy: scoreObject.accuracy,
		consistency: scoreObject.consistency,
		submissionDate: Timestamp.now()
	};

	try {
		const leaderboardQuery = query(
			funboxWordCountLeaderboardCollectionRef,
			where("username", "==", username),
			where("wordCount", "==", funboxWordCountScoreObject.wordCount),
			where("testMode", "==", funboxWordCountScoreObject.testMode),
			limit(1));
        
		const data = await getDocs(leaderboardQuery);

		// create new leaderboard document for user if needed
		if (data.empty) {
			await addDoc(funboxWordCountLeaderboardCollectionRef, funboxWordCountScoreObject);
			return;
		}

		// check if user has beaten their highscore 
		const currentLeaderboardDocument = data.docs[0].data() as FunboxWordCountScoreDocument;
		if (currentLeaderboardDocument.wpm > funboxWordCountScoreObject.wpm) {
			return;
		}

		// if beaten, update document
		const docRef = doc(database, FUNBOX_WORDCOUNT_LEADERBOARD, data.docs[0].id);
		await updateDoc(docRef, {
			wpm: funboxWordCountScoreObject.wpm,
			accuracy: funboxWordCountScoreObject.accuracy,
			consistency: funboxWordCountScoreObject.consistency,
			submissionDate: funboxWordCountScoreObject.submissionDate
		});

	} catch (error) {
		console.error(error);
	}
};
