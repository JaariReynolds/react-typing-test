import React from "react";
import "../styles/componentStyles/completion-bar.scss";


export interface CompletionBarProps {
	testCompletionPercentage: number
}

const CompletionBar = ({testCompletionPercentage}: CompletionBarProps) => {
	
	return (
		<div style={{width: testCompletionPercentage.toString() + "%"}} className="completion-bar"></div>
	);
};

export default CompletionBar;