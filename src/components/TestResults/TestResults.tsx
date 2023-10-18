/* eslint-disable react/jsx-key */
import "../../styles/componentStyles/typing-test-results.scss";

import React, { useEffect, useRef, useState} from "react";
import WpmGraph from "./WpmGraph";
import { createScoreDocument } from "../../firebase/POST/scorePosts";
import { useUserContext } from "../../contexts/UserContext";
import Statistics from "./Statistics";
import HighScores from "./HighScores";
import { updateUserSummary } from "../../firebase/POST/userPosts";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { calculateAccuracy } from "../../functions/calculations/calculateAccuracy";
import { calculateConsistency } from "../../functions/calculations/calculateConsistency";

export interface TestResultsProps {
   
	
	resultsComponentOpacity: number,
	resultsComponentDisplay: string
}

const TestResults = ({resultsComponentOpacity, resultsComponentDisplay}: TestResultsProps ) => {
	const {user, userDocument, isHeaderOpen, setIsHeaderOpen} = useUserContext();
	const {testInformation, setTestInformation, showResultsComponent, isTestSubmitted, setIsTestSubmitted} = useTestInformationContext();

	const [isCalculationsComplete, setIsCalculationsComplete] = useState<boolean>(false);

	const isHeaderOpenRef = useRef<boolean>();
	isHeaderOpenRef.current = isHeaderOpen;

	useEffect(() => {
		setIsCalculationsComplete(false);
	}, []);
	
	// once results screen shown, calculate extra info to show 
	useEffect(() => {
		if (showResultsComponent) {	
			setIsCalculationsComplete(false);

			const accuracy = calculateAccuracy(testInformation);
			const consistency = calculateConsistency(testInformation);	

			setTestInformation({
				...testInformation,
				accuracy: accuracy,
				consistency: consistency	
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

	return (
		<>	
			{showResultsComponent &&
			<div style={{opacity: resultsComponentOpacity, display: resultsComponentDisplay}} className="test-results-div">
				<div className="score-submit-row"> 
					{user ? 
						<div>{isTestSubmitted ? "test submitted" : "submitting test..."} </div> 
						:
						<button className="login-prompt" onClick={handleOpenHeader}>login to submit score</button>	
					}
				</div>
				<WpmGraph /> 
				<Statistics />
				<HighScores /> 
			</div>
			}
		</>		
	);
};

export default TestResults;