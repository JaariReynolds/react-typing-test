import React from "react";
import { useTestResultsContext } from "../../contexts/TestResultsContext";

const Statistics = () => {
	const {testInformation} = useTestResultsContext();

	return (
		<div className="test-results-statistics">
			<div className="grid-item">
				<div className="score">{testInformation.timeElapsedMilliSeconds / 1000}s</div>
				<div className="label">elapsed</div>
			</div>	
			<div className="grid-item">
				<div className="score">{(testInformation.accuracy * 100).toFixed(2)}%</div>						
				<div className="label">accuracy</div>
			</div>
			<div className="grid-item wpm">
				{testInformation.averageWPM}	
				<span className="wpm-label">wpm</span>
			</div>
			<div className="grid-item">
				<div className="score">{testInformation.errorCountHard}/{testInformation.errorCountSoft}</div>					
				<div className="label">hard/soft errors</div>						
			</div>		
			<div className="grid-item">
				<div className="score">{(testInformation.consistency * 100).toFixed(2)}%</div>					
				<div className="label">consistency</div>
			</div>		
		</div>
	);
};

export default Statistics;