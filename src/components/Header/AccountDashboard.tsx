import React, { useEffect, useRef, useState } from "react";
import { signOut, updateDisplayName } from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";
import "../../styles/componentStyles/account-dashboard.scss";
import { TestType } from "../../enums";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";
import MainSumary from "./MainSummary";
import SecondarySummary from "./SecondarySummary";

enum AccountTab {
	Main = "overview",
	Secondary = "test averages"
}

const AccountDashboard = () => {
	const {userDocument} = useUserContext();
	const [sortedSummaries, setSortedSummaries] = useState<TestSummary[]>([]);
	const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.Main);

	useEffect(() => {
		if (userDocument)
			setSortedSummaries(sortSummaries(userDocument!.testSummaries));
	}, [userDocument]);

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

	const handleTabClick = (tab: AccountTab) => {
		setActiveTab(tab);
	};


	// already assumes there is a user logged in 
	return (
		<div className="account-dashboard">		
			<div className="tab-container">
				<div className="tab-selector">
					<button 
						className={activeTab === AccountTab.Main ? "tab-selected" : ""} 
						onClick={() => handleTabClick(AccountTab.Main)}>
						{AccountTab.Main.toString()}
					</button>
					<button 
						className={activeTab === AccountTab.Secondary ? "tab-selected" : ""} 
						onClick={() => handleTabClick(AccountTab.Secondary)}>
						{AccountTab.Secondary.toString()}
					</button>
					<div 
						className="tab-selected-underline" 
						style={{transform: activeTab === AccountTab.Main ? "translateX(0%)" : "translateX(100%)"}}>
					</div>
				</div>

				<div className="tabbed-content">
					{activeTab === AccountTab.Main && <MainSumary />}
					{activeTab === AccountTab.Secondary && <SecondarySummary />}
				</div>
			</div>

			<button onClick={() => signOut()}>
				<FontAwesomeIcon icon={faDoorOpen} className="icon"/>
						log out
			</button>					
		</div>
	);
};

export default AccountDashboard;