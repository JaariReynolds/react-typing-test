/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useState, useEffect, createContext } from "react";
import { TimedScoreDocument, WordCountScoreDocument } from "../firebase/firestoreDocumentInterfaces";
import { getHighScores } from "../firebase/GET/scoreGets";
import { TestInformation } from "../interfaces/WordStructure";
import { TestType } from "../enums";
import { calculateAccuracy } from "../functions/calculations/calculateAccuracy";
import { calculateConsistency } from "../functions/calculations/calculateConsistency";


interface TestInformationContextProps {
    highScores: TimedScoreDocument[] | WordCountScoreDocument[],
    isTestSubmitted: boolean,
	setIsTestSubmitted: (bool: boolean) => void,
	testInformation: TestInformation,
	setTestInformation: React.Dispatch<React.SetStateAction<TestInformation>>,
	showResultsComponent: boolean,
	setShowResultsComponent: (bool: boolean) => void,
	isCalculationsComplete: boolean
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
	setIsTestSubmitted: () => {},
	testInformation: testInformationInitialState,
	setTestInformation: () => {},
	showResultsComponent: false,
	setShowResultsComponent: () => {},
	isCalculationsComplete: false
});

export const useTestInformationContext = () => {
	const results = useContext(TestInformationContext);
	if (results === undefined)
		throw new Error("useTestInformationContext must be used with a TestInformationContext");

	return results;
};

export const TestInformationProvider = ({children}: any) => {
	const [highScores, setHighScores] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);
	const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(localStorage.getItem("isSubmitted") === "true");
	const [testInformation, setTestInformation] = useState<TestInformation>(testInformationInitialState);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);

	const [isCalculationsComplete, setIsCalculationsComplete] = useState<boolean>(false);

	
    
	useEffect(() => {
		console.log("TestInformationContext mounted");
		setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
	}, []);

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
		highScores,
		isTestSubmitted,
		setIsTestSubmitted,
		testInformation, 
		setTestInformation,
		showResultsComponent,
		setShowResultsComponent,
		isCalculationsComplete
	};
	
	return (
		<TestInformationContext.Provider value={value}>
			{children}
		</TestInformationContext.Provider>
	);
};

