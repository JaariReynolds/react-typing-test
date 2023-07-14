/* eslint-disable react/jsx-key */

import React, { useEffect } from "react";
import { TestWords } from "../interfaces/WordStructure";
import TypingTestResultsWPMGraph from "./TypingTestResultsWPMGraph";

interface Props {
    testWords: TestWords, 
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
	showResultsComponent: boolean,
	resultsComponentStyling: React.CSSProperties
}

const TypingTestResults = ({testWords, setTestWords, showResultsComponent, resultsComponentStyling}: Props ) => {
	
	// once results screen shown, calculate extra info to show 
	useEffect(() => {
		if (showResultsComponent) {	
			const acc = calculateAccuracy();
				
			setTestWords({
				...testWords,
				accuracy: acc
			});	
		}
	}, [showResultsComponent]);

	// accuracy = (num characters in test - hard errors) / num characters in test
	const calculateAccuracy = (): number => {
		//NEED TO FIX : NOT WORKING AS INTENDED FOR SOME REASON
		const correctCharacters = testWords.keyPressCount - testWords.errorCountSoft;
		const acc = correctCharacters / testWords.keyPressCount;
		//console.log(testWords.rawWPMArray);
		return acc;
	};

	const typingTestResultsWPMGraphProps = {
		rawWPMArray: testWords.rawWPMArray,
		currentAverageWPMArray: testWords.currentAverageWPMArray
	};

	return (
		<>	
			{showResultsComponent &&
			<div style={resultsComponentStyling} className="test-results-div">
				 <TypingTestResultsWPMGraph {...typingTestResultsWPMGraphProps}/> 
				<div className="test-results-statistics">

					<div className="grid-item">
						<span className="score">
							{testWords.timeElapsedMilliSeconds / 1000}s
						</span>
						<br/>
						<span className="label">
							elapsed 
						</span>
					</div>

					<div className="grid-item">
						<span className="score">
							{(testWords.accuracy * 100).toFixed(2)}%
						</span>
						<br/>
						<span className="label">
							accuracy
						</span>
					</div>

					<div className="grid-item wpm">
						{testWords.averageWPM}
						<br/>
						<span className="wpm-label">
							wpm
						</span>
					</div>

					<div className="grid-item">
						<span className="score">
							{testWords.testType.toString()}
						</span>
						<br/>
						<span className="label">
							test type
						</span>
					</div>
					
					<div className="grid-item">
						<span className="score">
							{testWords.errorCountHard}/{testWords.errorCountSoft}
						</span>
						<br/>
						<span className="label">
							hard/soft errors
						</span>
						
					</div>
				</div>
			</div>
			}
		</>
		
	);
};

export default TypingTestResults;