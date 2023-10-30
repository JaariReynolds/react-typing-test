/* eslint-disable react/jsx-key */
import React from "react";
import "../../styles/componentStyles/secondary-summary.scss";
import { useUserContext } from "../../contexts/UserContext";
import { TestType } from "../../enums";

const SecondarySummary = () => {
	const {userDocument} = useUserContext();

	//#region test summary constants - might use this instead in the future, keeping for now 
	const words10 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Words && summary.testLength == 10);
	const words25 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Words && summary.testLength == 25);
	const words50 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Words && summary.testLength == 50);
	const words75 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Words && summary.testLength == 75);
	const words100 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Words && summary.testLength == 100);

	const timed15 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Time && summary.testLength == 15);
	const timed30 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Time && summary.testLength == 30);
	const timed45 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Time && summary.testLength == 45);
	const timed60 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Time && summary.testLength == 60);
	const timed120 = userDocument?.testSummaries.find(summary => summary.testType == TestType.Time && summary.testLength == 120);
	//#endregion

	const sortedSummaries = [timed15, timed30, timed45, timed60, timed120, words10, words25, words50, words75, words100];
	const timeWordColumnArray = [15, 30, 45, 60, 120, 10, 25, 50, 75, 100];

	return (
		<div className="secondary-summary-div">
			<div className="overflow-table">
				<table>
					<thead>
						<tr>
							<th className="sticky first-column"></th>
							<th className="sticky second-column">length</th>
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
									{index == 0 && <td rowSpan={5} className="test-type-label sticky first-column">time</td>}						
									{index == 5 && <td rowSpan={5} className="test-type-label sticky first-column">words</td>}		
										
									<td className="sticky second-column">{timeWordColumnArray[index]}</td>
									<td className="right-align">{summary ? summary.averageWpm.toFixed(0) : "n/a"}</td>
									<td className="right-align">{summary ? summary.highestWpm : "n/a"}</td>
									<td className="right-align">{summary ? (summary.averageAccuracy * 100).toFixed(2) + "%" : "n/a"}</td>
									<td className="right-align">{summary ?(summary.averageConsistency * 100).toFixed(2) + "%" : "n/a"}</td>
									<td className="right-align">{summary ? summary.submissionCount : 0}</td>
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