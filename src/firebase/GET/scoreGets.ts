import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { timedLeaderboardCollectionRef, wordCountLeaderboardCollectionRef } from "../firestoreConstants";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { TestType } from "../../enums";

const NUM_SCORES_FETCHED = 20;

export const getLeaderboard = async (testType: TestType, testLength: number): Promise<TimedScoreDocument[] | WordCountScoreDocument[]> => {
	switch (testType) {
	case TestType.Time:
		return getLeaderboardForTimedTest(testLength);
	case TestType.Words:
		return getLeaderboardForWordCountTest(testLength);
	}
};

// gets the top (NUM_SCORES_FETCHED) leaderboard for word count tests
const getLeaderboardForWordCountTest = async (wordCount: number) => {
	try {
		const leaderboardQuery = query(wordCountLeaderboardCollectionRef, where("wordCount", "==", wordCount), orderBy("wpm", "desc"), limit(NUM_SCORES_FETCHED));
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

// gets the top (NUM_SCORES_FETCHED) leaderboard for timed tests
const getLeaderboardForTimedTest = async (testLengthSeconds: number) => {
	try {
		const leaderboardQuery = query(timedLeaderboardCollectionRef, where("testLengthSeconds", "==", testLengthSeconds), orderBy("wpm", "desc"), limit(NUM_SCORES_FETCHED));
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

