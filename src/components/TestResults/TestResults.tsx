/* eslint-disable react/jsx-key */
import "./test-results.scss";

import React, { useEffect, useRef, useState} from "react";
import WpmGraph from "./WpmGraph";
import { createScoreDocument } from "../../firebase/POST/scorePosts";
import { useUserContext } from "../../contexts/UserContext";
import Statistics from "./Statistics";
import Leaderboard from "./Leaderboard";
import { updateUserSummary } from "../../firebase/POST/userPosts";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { TestMode } from "../../enums";
import { updateFunboxLeaderboardDocument } from "../../firebase/POST/funboxScorePosts";

export interface TestResultsProps {
	resultsComponentOpacity: number,
	resultsComponentDisplay: string
}

enum ResultsTab {
	Statistics = "statistics",
	Leaderboard = "leaderboard"
}

const ACCURACY_THRESHOLD = 0.4;
const CONSISTENCY_THRESHOLD = 0.25;

const TestResults = ({resultsComponentOpacity, resultsComponentDisplay}: TestResultsProps ) => {
	const {user, userDocument, isHeaderOpen, setIsHeaderOpen} = useUserContext();
	const {testInformation, showResultsComponent, isTestSubmitted, setIsTestSubmitted, isCalculationsComplete, leaderboard, fetchLeaderboard} = useTestInformationContext();
	const [activeTab, setActiveTab] = useState<ResultsTab>(ResultsTab.Statistics);
	const [scoreMessage, setScoreMessage] = useState<string>("");

	const isHeaderOpenRef = useRef<boolean>();
	isHeaderOpenRef.current = isHeaderOpen;

	useEffect(() => {
		if (showResultsComponent) {
			setActiveTab(ResultsTab.Statistics);
			setScoreMessage("submitting test...");
		}
	}, [showResultsComponent]);

	useEffect(() => {
		if (user && activeTab === ResultsTab.Leaderboard && leaderboard.length === 0)
			fetchLeaderboard();
	}, [activeTab]);
	
	// submit score when test hasnt already been submitted, user is logged in, all result calculations are done
	useEffect(() => {
		if (!isTestSubmitted && showResultsComponent && isCalculationsComplete && user && userDocument) {
			// threshold validation
			switch (testInformation.testMode) {
			case TestMode.Alphabet:
				if (testInformation.accuracy < 1) {
					setScoreMessage("unable to submit alphabet score: 100% accuracy required");
					return;
				}
				break;
			default: 
				if (testInformation.accuracy < ACCURACY_THRESHOLD) {
					setScoreMessage("unable to submit standard score: accuracy too low");
					return;
				} 
			}

			if (testInformation.consistency < CONSISTENCY_THRESHOLD) {
				setScoreMessage("unable to submit standard score: consistency too low");
				return;
			}

			handleScoreSubmit();
			
		}
	}, [isCalculationsComplete, user, userDocument, isTestSubmitted]);

	const handleScoreSubmit = async () => {
		try {
			setIsTestSubmitted(false);

			switch (testInformation.testMode) {
			case TestMode.Standard: 
				await createScoreDocument(userDocument!.username, testInformation);
				break;
			default: 
				await updateFunboxLeaderboardDocument(userDocument!.username, testInformation);
				break;
			}

			await updateUserSummary(user!.uid, testInformation);

			
			localStorage.setItem("isSubmitted", "true");
			setIsTestSubmitted(true);
			setScoreMessage("test submitted");
		} catch (error) {
			setScoreMessage("unable to submit score");
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
					<div>{scoreMessage}</div> 
					:
					<button className="login-prompt" onClick={handleOpenHeader}>log in to submit score and view leaderboard</button>	
				}
			</div>
		);
	};

	const handleTabClick = (tab: ResultsTab) => {
		setActiveTab(tab);
	};

	return (
		<>				
			<div style={{opacity: resultsComponentOpacity, display: resultsComponentDisplay}} className="test-results-div">
				{scoreSubmittedResponse()}
				{showResultsComponent && <WpmGraph />}			
				<div className="tab-selector">
					<button 
						className={activeTab === ResultsTab.Statistics ? "tab-selected" : ""} 
						onClick={() => handleTabClick(ResultsTab.Statistics)}>
						{ResultsTab.Statistics.toString()}
					</button>
					<button 
						className={activeTab === ResultsTab.Leaderboard ? "tab-selected" : ""} 
						onClick={() => handleTabClick(ResultsTab.Leaderboard)}>
						{ResultsTab.Leaderboard.toString()}
					</button>
					<div 
						className="tab-selected-underline" 
						style={{transform: activeTab === ResultsTab.Statistics ? "translateX(0%)" : "translateX(100%)"}}>
					</div>
				</div>
				<div className="tabbed-content">
					{activeTab === ResultsTab.Statistics && <Statistics />}
					{activeTab === ResultsTab.Leaderboard && <Leaderboard /> }
				</div>			
			</div>
			
		</>		
	);
};

export default TestResults;