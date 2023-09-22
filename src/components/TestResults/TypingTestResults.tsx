/* eslint-disable react/jsx-key */
import "../../styles/componentStyles/typing-test-results.scss";

import React, { useEffect } from "react";
import { TestWords } from "../../interfaces/WordStructure";
import TypingTestResultsWPMGraph from "./TypingTestResultsWPMGraph";
import { colourPalettes } from "../../interfaces/ColourPalettes";
import { createScoreDocument } from "../../firebase/firestorePost";
import { useUserContext } from "../../contexts/UserContext";

export interface TypingTestResultsProps {
    testWords: TestWords, 
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
	showResultsComponent: boolean,
	selectedPaletteId: number,
	resultsComponentOpacity: number,
	resultsComponentDisplay: string
}

const TypingTestResults = ({testWords, setTestWords, showResultsComponent, selectedPaletteId, resultsComponentOpacity, resultsComponentDisplay}: TypingTestResultsProps ) => {
	const {user} = useUserContext();

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

	const handleTestScoreSubmit = async () => {
		if (user) {
			try {
				await createScoreDocument(user.uid, testWords);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("not logged in!");
		}
	};

	const handleOpenHeader = () => {
		return;
	};
	
	

	// accuracy = (num characters in test - hard errors) / num characters in test
	const calculateAccuracy = (): number => {
		//NEED TO FIX : NOT WORKING AS INTENDED FOR SOME REASON
		const correctCharacters = testWords.keyPressCount - testWords.errorCountSoft;
		const acc = correctCharacters / testWords.keyPressCount;
		return acc;
	};

	const typingTestResultsWPMGraphProps = {
		rawWPMArray: testWords.rawWPMArray,
		currentAverageWPMArray: testWords.currentAverageWPMArray,
		colourPalette: colourPalettes[selectedPaletteId]
	};

	return (
		<>	
			{showResultsComponent &&
			<div style={{opacity: resultsComponentOpacity, display: resultsComponentDisplay}} className="test-results-div">
				 <TypingTestResultsWPMGraph {...typingTestResultsWPMGraphProps}/> 
				<div className="test-results-statistics">

					<div className="grid-item">
						<div className="score">
							{testWords.timeElapsedMilliSeconds / 1000}s
						</div>
					
						<div className="label">
							elapsed 
						</div>
					</div>

					<div className="grid-item">
						<div className="score">
							{(testWords.accuracy * 100).toFixed(2)}%
						</div>
						
						<div className="label">
							accuracy
						</div>
					</div>

					<div className="grid-item wpm">
						{testWords.averageWPM}
					
						<span className="wpm-label">
							wpm
						</span>
					</div>

					<div className="grid-item">
						<div className="score">
							{testWords.testType.toString()}
						</div>
						
						<div className="label">
							test type
						</div>
					</div>
					
					<div className="grid-item">
						<div className="score">
							{testWords.errorCountHard}/{testWords.errorCountSoft}
						</div>
					
						<div className="label">
							hard/soft errors
						</div>
						
					</div>

					<div className="grid-item score-submit-row"> 
						{user ? 
						 <button onClick={handleTestScoreSubmit}>submit score</button>
						 :
						 <button onClick={handleOpenHeader}>login to submit score</button>
							
						}
						
						
					</div>
				</div>
			</div>
			}
		</>		
	);
};

export default TypingTestResults;