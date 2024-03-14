import React, { useEffect, useState } from "react";
import { signOut } from "../../firebase/accountFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../../contexts/UserContext";
import "./account-dashboard.scss";
import { TestType } from "../../enums";
import { TestSummary } from "../../firebase/firestoreDocumentInterfaces";
import MainSumary from "./MainSummary";
import SecondarySummary from "./SecondarySummary";

export enum AccountTab {
  Main = "overview",
  Secondary = "averages",
}

const AccountDashboard = () => {
  const { user, userDocument } = useUserContext();
  const [activeTab, setActiveTab] = useState<AccountTab>(AccountTab.Main);

  const [sortedSummaries, setSortedSummaries] = useState<
    (TestSummary | undefined)[]
  >([]);

  useEffect(() => {
    if (!user) return;
    const words10 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Words && summary.testLength == 10
    );
    const words25 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Words && summary.testLength == 25
    );
    const words50 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Words && summary.testLength == 50
    );
    const words75 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Words && summary.testLength == 75
    );
    const words100 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Words && summary.testLength == 100
    );

    const timed15 = userDocument?.testSummaries.find(
      (summary) => summary.testType == TestType.Time && summary.testLength == 15
    );
    const timed30 = userDocument?.testSummaries.find(
      (summary) => summary.testType == TestType.Time && summary.testLength == 30
    );
    const timed45 = userDocument?.testSummaries.find(
      (summary) => summary.testType == TestType.Time && summary.testLength == 45
    );
    const timed60 = userDocument?.testSummaries.find(
      (summary) => summary.testType == TestType.Time && summary.testLength == 60
    );
    const timed120 = userDocument?.testSummaries.find(
      (summary) =>
        summary.testType == TestType.Time && summary.testLength == 120
    );

    setSortedSummaries([
      timed15,
      timed30,
      timed45,
      timed60,
      timed120,
      words10,
      words25,
      words50,
      words75,
      words100,
    ]);
  }, [userDocument]);

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
            onClick={() => handleTabClick(AccountTab.Main)}
          >
            {AccountTab.Main.toString()}
          </button>
          <button
            className={activeTab === AccountTab.Secondary ? "tab-selected" : ""}
            onClick={() => handleTabClick(AccountTab.Secondary)}
          >
            {AccountTab.Secondary.toString()}
          </button>
          <div
            className="tab-selected-underline"
            style={{
              transform:
                activeTab === AccountTab.Main
                  ? "translateX(0%)"
                  : "translateX(100%)",
            }}
          ></div>
        </div>

        <div className="tabbed-content">
          {activeTab === AccountTab.Main && (
            <MainSumary
              sortedSummaries={sortedSummaries}
              userDocument={userDocument}
              activeTab={activeTab}
            />
          )}
          {activeTab === AccountTab.Secondary && (
            <SecondarySummary sortedSummaries={sortedSummaries} />
          )}
        </div>
      </div>

      <button className="account-dashboard-footer" onClick={() => signOut()}>
        <FontAwesomeIcon icon={faDoorOpen} className="standard-icon-left" />
        log out
      </button>
    </div>
  );
};

export default AccountDashboard;
