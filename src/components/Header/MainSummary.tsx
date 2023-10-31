import React from "react";
import "./main-summary.scss";
import { useUserContext } from "../../contexts/UserContext";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";

const MainSumary = ({sortedSummaries} : {sortedSummaries: (TestSummary|undefined)[]} ) => {
	const {userDocument} = useUserContext();

	return (
		<div className="main-summary-div">
			<div className="level">test</div>
			<div className="statistic"></div>
			<div className="statistic">test</div>
			<div className="statistic">test</div>
			<div className="statistic">test</div>
			<div className="statistic">test</div>
			<div className="statistic">test</div>
			<div className="experience-indicator"></div>
		</div>
	
	);
};

export default MainSumary;