import { database } from "../firebase";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { Level, TestSummary, UserDocument } from "../firestoreDocumentInterfaces";
import { TestInformation } from "../../interfaces/WordStructure";
import { TestType } from "../../enums";
import { calculateRequiredExperience } from "../../functions/calculations/calculateExperience";

export const createUserDocument = async (userId: string, email: string, username: string) => {
	try {
		const newUserDocument = doc(database, "users", userId);
		const newUserObject: UserDocument = {
			email: email,
			username: username,
			testSummaries: [],
			creationDate: Timestamp.now(),
			level: {
				currentLevel: 1,
				experience: {
					currentExperience: 0,
					requiredExperience: 100
				}
			}
		};

		await setDoc(newUserDocument, newUserObject);
	} catch (error) {
		console.error(error);
	}
};

export const updateUserStatistics = async (userId: string, scoreObject: TestInformation) => {
	try {
		const userRef = doc(database, "users", userId);
		const data = await getDoc(userRef);

		if (!data.exists()) 
			throw new Error("user does not exist");

		const userDocument: UserDocument = data.data() as UserDocument; 
		
		//#region update userSummary
		// check if a summary already exists for the test parameters provided 
		const testSummaries = userDocument.testSummaries;
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
		//#endregion

		//#region update level
		const experienceGained = scoreObject.experience;
		const level = userDocument.level;

		let newCurrentLevel = level.currentLevel;
		let newCurrentExperience = level.experience.currentExperience + experienceGained;
		let newRequiredExperience = level.experience.requiredExperience;

		// if more than enough experience to level up
		if (newCurrentExperience > newRequiredExperience) {
			do {
				newCurrentLevel += 1;
				newCurrentExperience -= newRequiredExperience; // should read as "old required experience", as its being read before being overwritten
				newRequiredExperience = calculateRequiredExperience(newCurrentLevel);
			} while (newCurrentExperience > newRequiredExperience); 
		}

		const newLevelObject: Level = {
			currentLevel: newCurrentLevel,
			experience: {
				currentExperience: newCurrentExperience,
				requiredExperience: newRequiredExperience
			}
		};

		//#endregion
		await setDoc(userRef, {testSummaries: testSummaries, level: newLevelObject}, {merge: true});
		
	} catch (error) {
		console.error(error);
	}
};

const calculateNewAverage = (oldAverage: number, newValue: number, newArraySize: number): number => {
	return oldAverage + ((newValue - oldAverage) / newArraySize);
};

const createNewTestSummary = (scoreObject: TestInformation) => {
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

