/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState, useEffect, createContext } from "react";
import { TimedScoreDocument, WordCountScoreDocument } from "../firebase/firestoreDocumentInterfaces";
import { getLeaderboard as getLeaderboard } from "../firebase/GET/scoreGets";
import { TestInformation } from "../interfaces/WordStructure";
import { TestType } from "../enums";
import { calculateAccuracy } from "../functions/calculations/calculateAccuracy";
import { calculateConsistency } from "../functions/calculations/calculateConsistency";
import { useUserContext } from "./UserContext";
import { getUser } from "../firebase/GET/userGets";

interface TestInformationContextProps {
    leaderboard: TimedScoreDocument[] | WordCountScoreDocument[],
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
	testType: TestType.Words
};

export const TestInformationContext = createContext<TestInformationContextProps|undefined>({
	leaderboard: [],
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

	const [testLengthWords, setTestLengthWords] = useState<number>(parseInt( localStorage.getItem("testLengthWords") ?? "25"));
	const [testLengthSeconds, setTestLengthSeconds] = useState<number>(parseInt( localStorage.getItem("testLengthSeconds") ?? "30"));
	const [testType, setTestType] = useState<TestType>(localStorage.getItem("testType") as TestType ?? TestType.Time);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(localStorage.getItem("testIncludePunctuation") === "true" ?? false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(localStorage.getItem("testIncludeNumbers") === "true" ?? false);
	const [testOptionsChanged, setTestOptionsChanged] = useState<boolean>(false);
	const leaderboardTestLength = testType === TestType.Words ? testLengthWords : testLengthSeconds;

	const fetchLeaderboard = async () => {
		console.log("leaderboard fetched");
		setLeaderboard(await getLeaderboard(testType, leaderboardTestLength));		
	};

	const fetchUser = async (userId: string) => {
		const userDoc = await getUser(userId);
		if (!userDoc)
			return;
	
		setUserDocument(userDoc);
	};

	useEffect(() => {
		console.log("TestInformationContext mounted");
		setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
	}, []);
	
	useEffect(() => {
		// if test options change, clear the currently fetched leaderboard - allows repopulation once a new score is submitted
		setLeaderboard([]);
		setTestOptionsChanged(true);
	}, [testType, testLengthSeconds, testLengthWords, includeNumbers, includePunctuation, user]);


	useEffect(() => {
		if (!isTestSubmitted || !user) 
			return;

		//fetchLeaderboard();
		fetchUser(user.uid);
			
	}, [isTestSubmitted, user]);

	// refetch leaderboard situations - may come back to at a later stage
	const checkHighScoreRefetchSituations = () => {
		// if no highscores previously fetched, refetch now (guaranteed at least 1 now)
		if (leaderboard.length == 0) {
			fetchLeaderboard();
			return;
		}
		
		// ALSO HAS MINOR FLAW - user can flick through test options before settling back on the exact same test options as before 
		// if test options were changed previously, refetch 
		if (testOptionsChanged) {
			console.log("refetch because test optiosn were changed");
			fetchLeaderboard();
			setTestOptionsChanged(false);
			return;
		}

		// // if testType OR testLength of current test is different to previously fetched highscores, refetch
		// if (highScores[0].testType !== testInformation.testType || (highScores[0].testType == TestType.Time && highScores[0].testLengthSeconds !== testLengthSeconds) || (highScores[0].testType == TestType.Words && (highScores as WordCountScoreDocument[])[0].wordCount !== testLengthWords)) {
		// 	fetchHighScores();
		// 	return;
		// }

		// HAS FLAWS - doesnt take into consideration if the user already has a highscore
		// if user has broken into the highscores, refetch		
		const lowestHighScore = leaderboard[leaderboard.length - 1];
		if (testInformation.averageWPM > lowestHighScore!.wpm) {
			console.log("better score than previous worst, refetching high scores");
			fetchLeaderboard();	
			return;
		}
		
	};

	// once results screen shown, calculate final info for the TestInformation object
	useEffect(() => {
		if (showResultsComponent) {
			console.log("calculating test results..");
			setIsCalculationsComplete(false);
	
			const accuracy = calculateAccuracy(testInformation);
			const consistency = calculateConsistency(testInformation);	

			setTestInformation({
				...testInformation,
				accuracy: accuracy,
				consistency: consistency	
			});	

			setIsCalculationsComplete(true);
			console.log("test calculations done");
		}
		else {
			setIsCalculationsComplete(false);
			setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
		}
	}, [showResultsComponent]);

	const value: TestInformationContextProps = {
		leaderboard,
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
		testCompletionPercentage,
		setTestCompletionPercentage
	};
	
	return (
		<TestInformationContext.Provider value={value}>
			{children}
		</TestInformationContext.Provider>
	);
};

