import React, { useEffect, useRef, useState } from "react";
import { signOut, updateDisplayName } from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";
import "../../styles/componentStyles/account-dashboard.scss";
import { TestType } from "../../enums";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";

const AccountDashboard = () => {
	const {userDocument} = useUserContext();
	const [sortedSummaries, setSortedSummaries] = useState<TestSummary[]>([]);

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

	const sortSummaries = (unsortedSummaries: TestSummary[] | undefined): TestSummary[] => {
		if (typeof unsortedSummaries === "undefined") {
			return [];
		}

		return unsortedSummaries
			.sort((a, b) => 
				a.testLength - b.testLength
			)
			.sort((a, b) => {
				if (a.testType < b.testType) {
					return -1;
				}
				if (a.testType > b.testType) {
					return 1;
				}
				return 0;
			});
	};

	useEffect(() => {
		if (userDocument)
			setSortedSummaries(sortSummaries(userDocument!.testSummaries));
	}, [userDocument]);

	// already assumes there is a user logged in 
	return (
		<div className="account-dashboard">		
			<div className="main-summary">
				main
				<button onClick={() => signOut()}>
					<FontAwesomeIcon icon={faDoorOpen} className="icon"/>
						log out
				</button>
				
			</div>
			<div className="secondary-summary">
				<table>
					<thead>
						<tr>				
							<td></td>
							<td>wpm</td>
							<td>highest wpm</td>
							<td>accuracy</td>
							<td>consistency</td>
							<td>submissions</td>
						</tr>
					</thead>
					<tbody>
						{sortedSummaries.map((summary, index) => {
							return (
								<tr key={index}>
									<td>{summary.testType} {summary.testLength}</td>
									<td>{summary.averageWpm.toFixed(0)}</td>
									<td>{summary.highestWpm}</td>
									<td>{(summary.averageAccuracy * 100).toFixed(2)}%</td>
									<td>{(summary.averageConsistency * 100).toFixed(2)}%</td>
									<td>{summary.submissionCount}</td>
								</tr>
							);
						})}
					</tbody> 
				</table>
			</div>
		</div>
	);
};

export default AccountDashboard;