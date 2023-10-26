import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { timedHighScoresCollectionRef, wordCountHighScoresCollectionRef } from "../firestoreConstants";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { TestType } from "../../enums";

export const getLeaderboard = async (testType: TestType, testLength: number): Promise<TimedScoreDocument[] | WordCountScoreDocument[]> => {
	switch (testType) {
	case TestType.Time:
		return getLeaderboardForTimedTest(testLength);
	case TestType.Words:
		return getLeaderboardForWordCountTest(testLength);
	}
};

// gets the top 10 leaderboard for word count tests
const getLeaderboardForWordCountTest = async (wordCount: number) => {
	try {
		const leaderboardQuery = query(wordCountHighScoresCollectionRef, where("wordCount", "==", wordCount), orderBy("wpm", "desc"), limit(10));
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

// gets the top 10 leaderboard for timed tests
const getLeaderboardForTimedTest = async (testLengthSeconds: number) => {
	try {
		const leaderboardQuery = query(timedHighScoresCollectionRef, where("testLengthSeconds", "==", testLengthSeconds), orderBy("wpm", "desc"), limit(10));
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

