import React from "react";
import "../styles/componentStyles/completion-bar.scss";
import { useTestInformationContext } from "../contexts/TestInformationContext";


export interface CompletionBarProps {
	testCompletionPercentage: number,
}

const CompletionBar = ({testCompletionPercentage}: CompletionBarProps) => {
	const {showResultsComponent} = useTestInformationContext();
	
	return (
		<div style={{width: testCompletionPercentage.toString() + "%", opacity: showResultsComponent ? 0 : 1}} className="completion-bar"></div>
	);
};

export default CompletionBar;