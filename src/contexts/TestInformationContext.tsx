/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState, useEffect, createContext } from "react";
import { TimedScoreDocument, WordCountScoreDocument } from "../firebase/firestoreDocumentInterfaces";
import { getLeaderboard as getLeaderboard } from "../firebase/GET/scoreGets";
import { TestInformation } from "../interfaces/WordStructure";
import { TestMode, TestType } from "../enums";
import { calculateAccuracy } from "../functions/calculations/calculateAccuracy";
import { calculateConsistency } from "../functions/calculations/calculateConsistency";
import { useUserContext } from "./UserContext";
import { getUser } from "../firebase/GET/userGets";
import { calculateExperience } from "../functions/calculations/calculateExperience";
import { getFunboxLeaderboard } from "../firebase/GET/funboxScoreGets";

interface TestInformationContextProps {
    leaderboard: TimedScoreDocument[] | WordCountScoreDocument[],
	leaderboardLoading: boolean,
	fetchLeaderboard: () => void,
    isTestSubmitted: boolean,
	setIsTestSubmitted: (bool: boolean) => void,
	testInformation: TestInformation,
	setTestInformation: React.Dispatch<React.SetStateAction<TestInformation>>,
	showResultsComponent: boolean,
	setShowResultsComponent: (bool: boolean) => void,
	isCalculationsComplete: boolean,
	testLengthWords: number,
	setTestLengthWords: (testLength: number) => void,
	testLengthSeconds: number,
	setTestLengthSeconds: (testLength: number) => void,
	testType: TestType,
	setTestType: (testType: TestType) => void,
	includePunctuation: boolean,
	setIncludePunctuation: (bool: boolean) => void
	includeNumbers: boolean,
	setIncludeNumbers: (bool: boolean) => void,
	testMode: TestMode,
	setTestMode: (testMode: TestMode) => void,
	testCompletionPercentage: number,
	setTestCompletionPercentage: (completionPercentage: number) => void
}

const testInformationInitialState: TestInformation = {
	words: [], 
	errorCountHard: 0, 
	errorCountSoft: 0, 
	timeElapsedMilliSeconds: 0, 
	characterCount: 0, 
	keyPressCount: 0, 
	rawWPMArray: [], 
	currentAverageWPMArray: [], 
	averageWPM: 0, 
	accuracy: 0, 
	consistency: 0, 
	experience: 0,
	testType: TestType.Words,
	testMode: TestMode.Standard,
	includeNumbers: false,
	includePunctuation: false
};

export const TestInformationContext = createContext<TestInformationContextProps|undefined>({
	leaderboard: [],
	leaderboardLoading: false,
	fetchLeaderboard: () => {},
	isTestSubmitted: false,
	setIsTestSubmitted: () => {},
	testInformation: testInformationInitialState,
	setTestInformation: () => {},
	showResultsComponent: false,
	setShowResultsComponent: () => {},
	isCalculationsComplete: false,
	testLengthWords: 15,
	setTestLengthWords: () => {},
	testLengthSeconds: 15,
	setTestLengthSeconds: () => {},
	testType: TestType.Words,
	setTestType: () => {},
	includePunctuation: false,
	setIncludePunctuation: () => {},
	includeNumbers: false,
	setIncludeNumbers: () => {},
	testMode: TestMode.Standard,
	setTestMode: () => {},
	testCompletionPercentage: 0,
	setTestCompletionPercentage: () => {}
});

export const useTestInformationContext = () => {
	const results = useContext(TestInformationContext);
	if (results === undefined)
		throw new Error("useTestInformationContext must be used with a TestInformationContext");

	return results;
};

export const TestInformationProvider = ({children}: any) => {
	const {user, userDocument, setUserDocument} = useUserContext();
	const [testInformation, setTestInformation] = useState<TestInformation>(testInformationInitialState);
	const [testCompletionPercentage, setTestCompletionPercentage] = useState<number>(0);
	const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(localStorage.getItem("isSubmitted") === "true");
	const [isCalculationsComplete, setIsCalculationsComplete] = useState<boolean>(false);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);

	const [leaderboard, setLeaderboard] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);
	const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);

	const [testLengthWords, setTestLengthWords] = useState<number>(parseInt( localStorage.getItem("testLengthWords") ?? "25"));
	const [testLengthSeconds, setTestLengthSeconds] = useState<number>(parseInt( localStorage.getItem("testLengthSeconds") ?? "30"));
	const [testType, setTestType] = useState<TestType>(localStorage.getItem("testType") as TestType ?? TestType.Time);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(localStorage.getItem("testIncludePunctuation") === "true" ?? false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(localStorage.getItem("testIncludeNumbers") === "true" ?? false);
	const [testMode, setTestMode] = useState<TestMode>(localStorage.getItem("testMode") as TestMode ?? TestMode.Standard);

	const leaderboardTestLength = testType === TestType.Words ? testLengthWords : testLengthSeconds;

	const fetchLeaderboard = async () => {
		try {
			setLeaderboardLoading(true);

			switch (testInformation.testMode) {
			case TestMode.Standard:
				setLeaderboard(await getLeaderboard(testType, leaderboardTestLength));		
				break;
			default:
				setLeaderboard(await getFunboxLeaderboard(testType, leaderboardTestLength, testMode));
				break;
			}
			
		} catch (error) {
			console.error(error);
		} finally {
			setLeaderboardLoading(false);	
		}
	};

	const fetchUser = async (userId: string) => {
		const userDoc = await getUser(userId);
		if (!userDoc)
			return;
	
		setUserDocument(userDoc);
	};

	const finaliseTestStatistics = (testInformation: TestInformation): TestInformation => {
		const accuracy = calculateAccuracy(testInformation);
		const consistency = calculateConsistency(testInformation);	
		const newTestInformationObject: TestInformation = {...testInformation, accuracy: accuracy, consistency: consistency};

		const experience = calculateExperience(newTestInformationObject); // requires the new accuracy and consistency stats
		const finalTestInformationObject: TestInformation = {...newTestInformationObject, experience: experience};
		return finalTestInformationObject;
	};


	useEffect(() => {
		setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
	}, []);
	
	useEffect(() => {
		// if test options change, clear the currently fetched leaderboard - allows repopulation once a new score is submitted
		setLeaderboard([]);
	}, [testType, testLengthSeconds, testLengthWords, includeNumbers, includePunctuation, user]);

	useEffect(() => {
		if (!isTestSubmitted || !user) 
			return;

		fetchLeaderboard();
		fetchUser(user.uid);
			
	}, [isTestSubmitted, user]);

	// once results screen shown, calculate final info for the TestInformation object
	useEffect(() => {
		if (showResultsComponent) {
			//console.log("calculating test results..");
			setIsCalculationsComplete(false);
	
			const newTestStatistics = finaliseTestStatistics(testInformation);
			setTestInformation(newTestStatistics);

			setIsCalculationsComplete(true);
			///console.log("test calculations done");
		}
		else {
			setIsCalculationsComplete(false);
			setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
		}
	}, [showResultsComponent]);

	const value: TestInformationContextProps = {
		leaderboard,
		leaderboardLoading,
		fetchLeaderboard,
		isTestSubmitted,
		setIsTestSubmitted,	
		testInformation, 
		setTestInformation,
		showResultsComponent,
		setShowResultsComponent,
		isCalculationsComplete,
		testLengthWords,
		setTestLengthWords,
		testLengthSeconds,
		setTestLengthSeconds,
		testType,
		setTestType,
		includePunctuation,
		setIncludePunctuation,
		includeNumbers,
		setIncludeNumbers,
		testMode,
		setTestMode,
		testCompletionPercentage,
		setTestCompletionPercentage
	};
	
	return (
		<TestInformationContext.Provider value={value}>
			{children}
		</TestInformationContext.Provider>
	);
};

