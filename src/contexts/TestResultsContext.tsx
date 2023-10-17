import React, { useContext, useState, useEffect, createContext } from "react";
import { TimedScoreDocument, WordCountScoreDocument } from "../firebase/firestoreDocumentInterfaces";
import { getHighScores } from "../firebase/GET/scoreGets";
import { TestWords } from "../interfaces/WordStructure";

interface TestResultsInfo {
    highScores: TimedScoreDocument[] | WordCountScoreDocument[],
    isTestSubmitted: boolean,
}

export const TestResultsContext = createContext<TestResultsInfo|undefined>({
	highScores: [],
	isTestSubmitted: false
});

export const useTestResultsContext = () => {
	const results = useContext(TestResultsContext);
	if (results === undefined)
		throw new Error("useTestResultsContext must be used with a TestResultsContext");

	return results;
};

export const TestResultsProvider = ({children}: any) => {
	const [highScores, setHighScores] = useState<TimedScoreDocument[] | WordCountScoreDocument[]>([]);
	const [testResults, setTestResults] = useState<TestWords>();
	const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
	
    
	useEffect(() => {
		console.log("TestResultsContext mounted");
		
	}, []);

	const value: TestResultsInfo = {
		highScores,
		isTestSubmitted
	};

	return (
		<TestResultsContext.Provider value={value}>
			{children}
		</TestResultsContext.Provider>
	);
};

