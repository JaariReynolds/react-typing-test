import React from "react";
import "../styles/componentStyles/completion-bar.scss";


export interface CompletionBarProps {
	testCompletionPercentage: number,
	showResultsComponent: boolean
}

const CompletionBar = ({testCompletionPercentage, showResultsComponent}: CompletionBarProps) => {
	
	return (
		<div style={{width: testCompletionPercentage.toString() + "%", opacity: showResultsComponent ? 0 : 1}} className="completion-bar"></div>
	);
};

export default CompletionBar;