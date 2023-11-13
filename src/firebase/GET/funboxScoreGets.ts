import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { TestMode, TestType } from "../../enums";
import { NUM_SCORES_FETCHED, funboxTimedLeaderboardCollectionRef, funboxWordCountLeaderboardCollectionRef } from "../firestoreConstants";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";

export const getFunboxLeaderboard = async (testType: TestType, testLength: number, testMode: TestMode) => {
	switch (testType) {
	case TestType.Time:
		return getFunboxLeaderboardForTimedTest(testLength, testMode);
	case TestType.Words: 
		return getFunboxLeaderboardForWordCountTest(testLength, testMode);
	}
};

// gets the top (NUM_SCORES_FETCHED) leaderboard for word count tests
const getFunboxLeaderboardForWordCountTest = async (wordCount: number, testMode: TestMode) => {
	try {
		const leaderboardQuery = query(
			funboxWordCountLeaderboardCollectionRef, 
			where("wordCount", "==", wordCount),
			where("testMode", "==", testMode),
			orderBy("wpm", "desc"), 
			limit(NUM_SCORES_FETCHED));

		const data = await getDocs(leaderboardQuery);

		if (data.empty)
			throw new Error("unable to retrieve leaderboard");

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

const getFunboxLeaderboardForTimedTest = async (testLengthSeconds: number, testMode: TestMode) => {
	try {
		const leaderboardQuery = query(
			funboxTimedLeaderboardCollectionRef, 
			where("testLengthSeconds", "==", testLengthSeconds), 
			where("testMode", "==", testMode),
			orderBy("wpm", "desc"), 
			limit(NUM_SCORES_FETCHED));

		const data = await getDocs(leaderboardQuery);

		if (data.empty)
			throw new Error("unable to retrieve leaderboard");

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

