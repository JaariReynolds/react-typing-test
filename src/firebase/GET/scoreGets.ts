import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { timedHighScoresCollectionRef, wordCountHighScoresCollectionRef } from "../firestoreConstants";
import { TimedScoreDocument, WordCountScoreDocument } from "../firestoreDocumentInterfaces";
import { TestType } from "../../enums";

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
		const highScoresQuery = query(wordCountHighScoresCollectionRef, where("wordCount", "==", wordCount), orderBy("wpm", "desc"), limit(10));
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
		const highScoresQuery = query(timedHighScoresCollectionRef, where("testLengthMilliseconds", "==", testLengthMilliseconds), orderBy("wpm", "desc"), limit(10));
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

