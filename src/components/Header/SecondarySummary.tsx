/* eslint-disable react/jsx-key */
import React from "react";
import "./secondary-summary.scss";
import { useUserContext } from "../../contexts/UserContext";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";

const SecondarySummary = ({ sortedSummaries }: { sortedSummaries: (TestSummary|undefined)[]}) => {
	const {userDocument} = useUserContext();

	//#region test summary constants  
	const timeWordColumnArray = [15, 30, 45, 60, 120, 10, 25, 50, 75, 100];

	return (		
		<div className="secondary-summary-div">
			<div className="overflow-table">
				<table className="horizontal-table">
					<thead>
						<tr>
							<th className="sticky first-column"></th>
							<th className="sticky second-column"></th>
							<th className="right-align">wpm</th>
							<th className="right-align">peak wpm</th>
							<th className="right-align">accuracy</th>
							<th className="right-align">consistency</th>
							<th className="right-align">submissions</th>
						</tr>
					</thead>
					<tbody>
						{sortedSummaries.map((summary, index) => {						
							return (
								<tr key={index}>	
									{index == 0 && 
										<th rowSpan={5} className="test-type-label sticky first-column">time</th>}						
									{index == 5 && 
										<th rowSpan={5} className="test-type-label sticky first-column">words</th>}		
									<th className="sticky second-column">{timeWordColumnArray[index]}</th>
									<td className="right-align">{summary ? summary.averageWpm.toFixed(0) : "-"}</td>
									<td className="right-align">{summary ? summary.highestWpm : "-"}</td>
									<td className="right-align">{summary ? (summary.averageAccuracy * 100).toFixed(2) + "%" : "-"}</td>
									<td className="right-align">{summary ?(summary.averageConsistency * 100).toFixed(2) + "%" : "-"}</td>
									<td className="right-align">{summary ? summary.submissionCount : "-"}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>					
	);
};

export default SecondarySummary;