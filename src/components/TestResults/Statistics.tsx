import React from "react";
import "./statistics.scss";
import { useTestInformationContext } from "../../contexts/TestInformationContext";

const Statistics = () => {
	const {testInformation} = useTestInformationContext();

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
			<div className="grid-item wpm-grid">
				<div className="wpm">{testInformation.averageWPM}</div>
				<div className="label">wpm</div>
			</div>
			<div className="grid-item">
				<div className="score">{testInformation.errorCountHard + testInformation.errorCountSoft}</div>					
				<div className="label">errors</div>						
			</div>		
			<div className="grid-item">
				<div className="score">{(testInformation.consistency * 100).toFixed(2)}%</div>					
				<div className="label">consistency</div>
			</div>	
			<div className="grid-item experience-grid">
				<div className="experience">{testInformation.experience}</div>
				<div className="label">experience</div>
			</div>

		</div>
	);
};

export default Statistics;