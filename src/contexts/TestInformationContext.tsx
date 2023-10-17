/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState, useEffect, createContext } from "react";
import { TimedScoreDocument, WordCountScoreDocument } from "../firebase/firestoreDocumentInterfaces";
import { getHighScores } from "../firebase/GET/scoreGets";
import { TestInformation } from "../interfaces/WordStructure";
import { TestType } from "../enums";


interface TestInformationContextProps {
    highScores: TimedScoreDocument[] | WordCountScoreDocument[],
    isTestSubmitted: boolean,
	testInformation: TestInformation,
	setTestInformation: React.Dispatch<React.SetStateAction<TestInformation>>
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
	highScores: [],
	isTestSubmitted: false,
	testInformation: testInformationInitialState,
	setTestInformation: () => {},
});

export const useTestInformationContext = () => {
	const results = useContext(TestInformationContext);
	if (results === undefined)
		throw new Error("useTestInformationContext must be used with a TestInformationContext");

	return results;
};

export const TestInformationProvider = ({children}: any) => {
	const [highScores, setHighScores] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);
	const [testResults, setTestResults] = useState<TestInformation>();
	const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
	const [testInformation, setTestInformation] = useState<TestInformation>(testInformationInitialState);
	
    
	useEffect(() => {
		console.log("TestInformationContext mounted");
		
	}, []);

	const value: TestInformationContextProps = {
		highScores,
		isTestSubmitted,
		testInformation, 
		setTestInformation
	};

	return (
		<TestInformationContext.Provider value={value}>
			{children}
		</TestInformationContext.Provider>
	);
};

