import React, { useEffect, useState } from "react";
import "./main-summary.scss";
import { TestSummary, UserDocument } from "../../firebase/firestoreDocumentInterfaces";
import { useUserContext } from "../../contexts/UserContext";
import { AccountTab } from "./AccountDashboard";

const HEADER_TRANSITION_DURATION = 300;

interface MainSummaryProps {
	sortedSummaries: (TestSummary | undefined)[],
	userDocument: UserDocument | null,
	activeTab: AccountTab
}

const MainSumary = ({sortedSummaries, userDocument, activeTab}: MainSummaryProps) => {
	const {isHeaderOpen} = useUserContext();
	const [experienceBarWidth, setExperienceBarWidth] = useState<number>(0);

	useEffect(() => {
		if (activeTab === AccountTab.Main && isHeaderOpen) {
			setExperienceBarWidth(0);
			setTimeout(() => {
				setExperienceBarWidth((userDocument!.level.experience.currentExperience / userDocument!.level.experience.requiredExperience) * 100);
			}, HEADER_TRANSITION_DURATION);
		}

		if (!isHeaderOpen)
			setTimeout(() => {
				setExperienceBarWidth(0);
			}, HEADER_TRANSITION_DURATION);

	}, [isHeaderOpen]);

	const filteredSummaries: TestSummary[] = sortedSummaries.filter((summary): summary is TestSummary => summary !== undefined);
	const peakWpm = filteredSummaries.reduce((max, current) => current.highestWpm > max ? current.highestWpm : max, 0);
	const averageWpm = (filteredSummaries.reduce((total, summary) => total + summary.averageWpm, 0) / filteredSummaries.length).toFixed(2);
	const averageConsistency = ((filteredSummaries.reduce((total, summary) => total + summary.averageConsistency, 0) / filteredSummaries.length) * 100).toFixed(2);
	const averageAccuracy = ((filteredSummaries.reduce((total, summary) => total + summary.averageAccuracy, 0) / filteredSummaries.length) * 100).toFixed(2);
	const submissions = filteredSummaries.reduce((total, summary) => total + summary.submissionCount, 0);

	return (
		<div className="main-summary-div">
			<div className="level">
				{userDocument!.level.currentLevel}
				<div className="level-label">level</div>
			</div>
			
			<div className="statistic">
				{peakWpm == 0 ? "-" : peakWpm}
				<div className="statistic-label">peak wpm</div>
			</div>
			<div className="statistic">
				{isNaN(parseFloat(averageWpm)) ? "-" : averageWpm}
				<div className="statistic-label">wpm</div>
			</div>
			<div className="statistic">
				{isNaN(parseFloat(averageAccuracy)) ? "-" : averageAccuracy + "%"}
				<div className="statistic-label">accuracy</div>
			</div>
			<div className="statistic">
				{isNaN(parseFloat(averageConsistency)) ? "-" : averageConsistency + "%"}

				<div className="statistic-label">consistency</div>
			</div>
			<div className="statistic">
				{submissions == 0 ? "-" : submissions}
				<div className="statistic-label">submissions</div>
			</div>
			<div className="statistic">
				???
				<div className="statistic-label">idk yet</div>
			</div>
			
			<div className="experience-indicator">
				<div className="current-experience-text">{userDocument!.level.experience.currentExperience}/{userDocument!.level.experience.requiredExperience}xp</div>
				<div className="current-experience-bar" style={{width: experienceBarWidth + "%"}}></div>
			</div>
		</div>
	
	);
};

export default MainSumary;