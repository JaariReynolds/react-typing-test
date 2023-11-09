import React from "react";
import "./completion-bar.scss";
import { useTestInformationContext } from "../../contexts/TestInformationContext";

const CompletionBar = () => {
	const {showResultsComponent, testCompletionPercentage} = useTestInformationContext();
	
	return (
		<div style={{width: testCompletionPercentage.toString() + "%", opacity: showResultsComponent ? 0 : 1}} className="completion-bar"></div>
	);
};

export default CompletionBar;