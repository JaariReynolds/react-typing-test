/* eslint-disable react/jsx-key */

import React, { useEffect, useState } from "react";
import { TestWords } from "../interfaces/WordStructure";
import MyChartComponent from "./TypingTestResultsWPMGraph";

interface IProps {
    testWords: TestWords, 
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
	showResults: boolean,
}

const TypingTestResults = ({testWords, setTestWords, showResults}: IProps ) => {
	
	// once results screen shown, calculate extra info to show 
	useEffect(() => {
		if (showResults) {	
			const acc = calculateAccuracy();
	
			setTestWords({
				...testWords,
				accuracy: acc
			});	
		}
	}, [showResults]);

	// accuracy = (num characters in test - hard errors) / num characters in test
	const calculateAccuracy = (): number => {
		//NEED TO FIX : NOT WORKING AS INTENDED FOR SOME REASON
		const correctCharacters = testWords.characterCount - testWords.errorCountSoft;
		const acc = correctCharacters / testWords.characterCount;
		//console.log(testWords.rawWPMArray);
		return acc;
	};

	return (
		<>
			{ showResults && 
			<div className="results-chart">
				<MyChartComponent rawWPMArray={testWords.rawWPMArray} averageWPMArray={testWords.currentAverageWPMArray}/> 
			</div>
			}
			{/* <div>currentAverage: {testWords.currentAverageWPMArray.map(numberPair => {
				return (
					<div>{numberPair.interval}: {numberPair.wpm}</div>
				);
			})}
			</div>

			<div>raw: {testWords.rawWPMArray.map(numberPair => {
				return (
					<div>{numberPair.interval}: {numberPair.wpm}</div>
				);
			})}
			</div> */}
			<div>Test Time: {testWords.timeElapsedMilliSeconds / 1000}</div>
			<div>Average WPM: {testWords.averageWPM}</div>
			<div>Error Count Hard: {testWords.errorCountHard}</div>
			<div>Error Count Soft: {testWords.errorCountSoft}</div>
			<div>Total Character Count: {testWords.characterCount}</div>
			<div>Key Press Count: {testWords.keyPressCount}</div>
			<div>Accuracy: {testWords.accuracy}</div>
		</>
	);
};

export default TypingTestResults;