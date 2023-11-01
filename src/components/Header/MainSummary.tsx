import React, { useEffect, useMemo } from "react";
import "./main-summary.scss";
import { useUserContext } from "../../contexts/UserContext";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";

const MainSumary = ({sortedSummaries} : {sortedSummaries: (TestSummary|undefined)[]} ) => {
	const {userDocument} = useUserContext();
	const filteredSummaries: TestSummary[] = sortedSummaries.filter((summary): summary is TestSummary => summary !== undefined);

	const peakWpm = filteredSummaries.reduce((max, current) => {
		return current.highestWpm > max ? current.highestWpm : max; 
	}, 0);

	const averageWpm = (filteredSummaries
		.reduce((total, summary) => total + summary.averageWpm, 0) / filteredSummaries.length).toFixed(2);
	 
	const averageConsistency = ((filteredSummaries.reduce((total, summary) => total + summary.averageConsistency, 0) / filteredSummaries.length) * 100).toFixed(2);
 
	const averageAccuracy = ((filteredSummaries.reduce((total, summary) => total + summary.averageAccuracy, 0) / filteredSummaries.length) * 100).toFixed(2);

	const submissions = filteredSummaries.reduce((total, summary) => total + summary.submissionCount, 0);

	return (
		<div className="main-summary-div">
			<div className="level">
				23
				<div className="level-label">level</div>
			</div>
			
			<div className="statistic">
				{peakWpm}
				<div className="statistic-label">peak wpm</div>
			</div>
			<div className="statistic">
				{averageWpm}
				<div className="statistic-label">wpm</div>
			</div>
			<div className="statistic">
				{averageAccuracy}%
				<div className="statistic-label">accuracy</div>
			</div>
			<div className="statistic">
				{averageConsistency}%
				<div className="statistic-label">consistency</div>
			</div>
			<div className="statistic">
				{submissions}
				<div className="statistic-label">submissions</div>
			</div>
			<div className="statistic">
				???
				<div className="statistic-label">idk yet</div>
			</div>
			
			<div className="experience-indicator">
				<div className="current-experience-text">784/1000xp</div>
				<div className="current-experience-bar"></div>
			</div>
		</div>
	
	);
};

export default MainSumary;