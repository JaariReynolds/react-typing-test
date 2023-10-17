import { database } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { TestSummary, UserDocument } from "../firestoreDocumentInterfaces";
import { TestWords } from "../../interfaces/WordStructure";
import { TestType } from "../../enums";

export const createUserDocument = async (userId: string, email: string, username: string) => {
	try {
		const newUserDocument = doc(database, "users", userId);
		const newUserObject: UserDocument = {
			email: email,
			username: username,
			testSummaries: [],
			creationDate: new Date(),
		};

		await setDoc(newUserDocument, newUserObject);
	} catch (error) {
		console.error(error);
	}
};

export const updateUserSummary = async (userId: string, scoreObject: TestWords) => {
	try {
		const userRef = doc(database, "users", userId);
		const data = await getDoc(userRef);

		if (!data.exists()) 
			throw new Error("user does not exist");

		const userDocument: UserDocument = data.data() as UserDocument; 
		const testSummaries = userDocument.testSummaries;
		
		// check if a summary already exists for the test parameters provided 
		let matchingSummary = testSummaries.find((summary) => summary.testType === scoreObject.testType.toString() && (summary.testLength === scoreObject.words.length || summary.testLength === scoreObject.timeElapsedMilliSeconds / 1000));
		
		if (matchingSummary) { // update existing summary
			const newSubmissionCount = matchingSummary.submissionCount += 1;
			matchingSummary.submissionCount = newSubmissionCount;
			matchingSummary.averageAccuracy = calculateNewAverage(matchingSummary.averageAccuracy, scoreObject.accuracy, newSubmissionCount);
			matchingSummary.averageConsistency = calculateNewAverage(matchingSummary.averageConsistency, scoreObject.consistency, newSubmissionCount);
			matchingSummary.averageWpm = calculateNewAverage(matchingSummary.averageWpm, scoreObject.averageWPM, newSubmissionCount);
			if (scoreObject.averageWPM > matchingSummary.highestWpm)
				matchingSummary.highestWpm = scoreObject.averageWPM;			
		}
		else { // create new summary
			matchingSummary = createNewTestSummary(scoreObject);
			testSummaries.push(matchingSummary);
		}

		await setDoc(userRef, {testSummaries: testSummaries}, {merge: true});
		

	} catch (error) {
		console.error(error);
	}
};

const calculateNewAverage = (oldAverage: number, newValue: number, newArraySize: number): number => {
	return oldAverage + ((newValue - oldAverage) / newArraySize);
};

const createNewTestSummary = (scoreObject: TestWords) => {
	const newSummary: TestSummary = {
		testType: scoreObject.testType.toString(),
		testLength: scoreObject.testType === TestType.Words ? scoreObject.words.length : scoreObject.timeElapsedMilliSeconds / 1000,
		submissionCount: 1,
		averageWpm: scoreObject.averageWPM,
		averageAccuracy: scoreObject.accuracy,
		averageConsistency: scoreObject.consistency,
		highestWpm: scoreObject.averageWPM
	};

	return newSummary;
};

