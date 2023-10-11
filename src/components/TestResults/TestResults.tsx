/* eslint-disable react/jsx-key */
import "../../styles/componentStyles/typing-test-results.scss";

import React, { useEffect, useRef, useState} from "react";
import { TestWords } from "../../interfaces/WordStructure";
import WpmGraph, { WpmGraphProps } from "./WpmGraph";
import { colourPalettes } from "../../interfaces/ColourPalettes";
import { createScoreDocument } from "../../firebase/firestorePost";
import { useUserContext } from "../../contexts/UserContext";
import Statistics, { StatisticsProps } from "./Statistics";
import HighScores, { HighScoresProps } from "./HighScores";
import { TestType } from "../../App";

export interface TestResultsProps {
    testWords: TestWords, 
    setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
	showResultsComponent: boolean,
	resultsComponentOpacity: number,
	resultsComponentDisplay: string
}

const TestResults = ({testWords, setTestWords, showResultsComponent, resultsComponentOpacity, resultsComponentDisplay}: TestResultsProps ) => {
	const {user, userDocument, isHeaderOpen, setIsHeaderOpen, selectedPaletteId} = useUserContext();
	const [isCalculationsComplete, setIsCalculationsComplete] = useState<boolean>(false);
	const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(localStorage.getItem("isSubmitted") === "true");
	const isHeaderOpenRef = useRef<boolean>();
	isHeaderOpenRef.current = isHeaderOpen;

	useEffect(() => {
		setIsCalculationsComplete(false);
		setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
	}, []);
	
	// once results screen shown, calculate extra info to show 
	useEffect(() => {
		if (showResultsComponent) {	
			setIsCalculationsComplete(false);

			const acc = calculateAccuracy();	
			setTestWords({
				...testWords,
				accuracy: acc
			});	

			setIsCalculationsComplete(true);
		}
		else {
			setIsCalculationsComplete(false);
			setIsTestSubmitted(localStorage.getItem("isSubmitted") === "true");
		}
	}, [showResultsComponent]);

	// submit score when test hasnt already been submitted, user is logged in, and all result calculations are done
	useEffect(() => {
		if (!isTestSubmitted && showResultsComponent && isCalculationsComplete && user && userDocument)
			handleScoreSubmit();
	}, [isCalculationsComplete, user, userDocument, isTestSubmitted]);

	const handleScoreSubmit = async () => {
		try {
			setIsTestSubmitted(false);
			await createScoreDocument(userDocument!.username, testWords);
			localStorage.setItem("isSubmitted", "true");
			setIsTestSubmitted(true);
		} catch (error) {
			console.error(error);
		}		
	};

	const handleOpenHeader = () => {
		setIsHeaderOpen(true);
	};

	// accuracy = (num characters in test - hard errors) / num characters in test
	const calculateAccuracy = (): number => {
		//NEED TO FIX : NOT WORKING AS INTENDED FOR SOME REASON
		const correctCharacters = testWords.keyPressCount - testWords.errorCountSoft;
		const acc = correctCharacters / testWords.keyPressCount;
		return acc;
	};

	const wpmGraphProps: WpmGraphProps = {
		rawWPMArray: testWords.rawWPMArray,
		currentAverageWPMArray: testWords.currentAverageWPMArray,
		colourPalette: colourPalettes[selectedPaletteId]
	};

	const statisticsProps: StatisticsProps = {
		testWords: testWords
	};

	const highScoresProps: HighScoresProps = {
		isTestSubmitted: isTestSubmitted,
		testType: testWords.testType,
		testLength: testWords.testType === TestType.Time ? testWords.timeElapsedMilliSeconds : testWords.words.length
	};

	return (
		<>	
			{showResultsComponent &&
			<div style={{opacity: resultsComponentOpacity, display: resultsComponentDisplay}} className="test-results-div">
				<div className="grid-item score-submit-row"> 
					{user ? 
						<div>{isTestSubmitted ? "test submitted" : "submitting test..."} </div> 
						:
						<button onClick={handleOpenHeader}>login to submit score</button>	
					}
				</div>
				 <WpmGraph {...wpmGraphProps}/> 
				 <Statistics {...statisticsProps}/>

				 {isTestSubmitted && 
				 	<HighScores {...highScoresProps} />
				}
				 
			</div>
			}
		</>		
	);
};

export default TestResults;