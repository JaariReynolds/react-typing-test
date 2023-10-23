/* eslint-disable react/jsx-key */
import "../../styles/componentStyles/typing-test-results.scss";

import React, { useEffect, useRef} from "react";
import WpmGraph from "./WpmGraph";
import { createScoreDocument } from "../../firebase/POST/scorePosts";
import { useUserContext } from "../../contexts/UserContext";
import Statistics from "./Statistics";
import HighScores from "./HighScores";
import { updateUserSummary } from "../../firebase/POST/userPosts";
import { useTestInformationContext } from "../../contexts/TestInformationContext";

export interface TestResultsProps {
   
	
	resultsComponentOpacity: number,
	resultsComponentDisplay: string
}

const TestResults = ({resultsComponentOpacity, resultsComponentDisplay}: TestResultsProps ) => {
	const {user, userDocument, isHeaderOpen, setIsHeaderOpen} = useUserContext();
	const {testInformation, showResultsComponent, isTestSubmitted, setIsTestSubmitted, isCalculationsComplete} = useTestInformationContext();

	const isHeaderOpenRef = useRef<boolean>();
	isHeaderOpenRef.current = isHeaderOpen;
	
	// submit score when test hasnt already been submitted, user is logged in, and all result calculations are done
	useEffect(() => {
		if (!isTestSubmitted && showResultsComponent && isCalculationsComplete && user && userDocument)
			handleScoreSubmit();
	}, [isCalculationsComplete, user, userDocument, isTestSubmitted]);

	const handleScoreSubmit = async () => {
		try {
			setIsTestSubmitted(false);
			await createScoreDocument(userDocument!.username, testInformation);
			await updateUserSummary(user!.uid, testInformation);
			localStorage.setItem("isSubmitted", "true");
			setIsTestSubmitted(true);
		} catch (error) {
			console.error(error);
		}		
	};

	const handleOpenHeader = () => {
		setIsHeaderOpen(true);
	};

	const scoreSubmittedResponse = () => {
		return (
			<div className="score-submit-row"> 
				{user ? 
					<div>{isTestSubmitted ? "test submitted" : "submitting test..."} </div> 
					:
					<button className="login-prompt" onClick={handleOpenHeader}>login to submit score and view highscores</button>	
				}
			</div>
		);
	};

	return (
		<>	
			
			<div style={{opacity: resultsComponentOpacity, display: resultsComponentDisplay}} className="test-results-div">
				{scoreSubmittedResponse()}
				{showResultsComponent && <WpmGraph />}
				 
				<Statistics />
				<HighScores /> 
			</div>
			
		</>		
	);
};

export default TestResults;