import React from "react";
import "./test-mode-selector.scss";
import { TestModeTabs } from "./ModeOptions/ModeOptions";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { TestMode } from "../../enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faKeyboard } from "@fortawesome/free-solid-svg-icons";

interface TestModeSelectorProps {
  activeTab: TestModeTabs;
  setActiveTab: React.Dispatch<React.SetStateAction<TestModeTabs>>;
}

const TestModeSelector = ({
  activeTab,
  setActiveTab,
}: TestModeSelectorProps) => {
  const { setTestMode, funboxMode } = useTestInformationContext();

  const handleTabClick = (tab: TestModeTabs) => {
    setActiveTab(tab);
    localStorage.setItem("testModeTab", tab);

    if (tab === TestModeTabs.Standard) {
      setTestMode(TestMode.Standard);
      localStorage.setItem("testMode", TestModeTabs.Standard);
    } else {
      setTestMode(funboxMode);
      localStorage.setItem("testMode", funboxMode);
    }
  };

  return (
    <div className="test-mode-container">
      <div className="tab-selector no-underline">
        <button
          className={activeTab === TestModeTabs.Standard ? "tab-selected" : ""}
          onClick={() => handleTabClick(TestModeTabs.Standard)}
        >
          <FontAwesomeIcon icon={faKeyboard} className="standard-icon-left" />
          {TestModeTabs.Standard.toString()}
        </button>
        <button
          className={activeTab === TestModeTabs.Funbox ? "tab-selected" : ""}
          onClick={() => handleTabClick(TestModeTabs.Funbox)}
        >
          <FontAwesomeIcon icon={faGamepad} className="standard-icon-left" />
          {TestModeTabs.Funbox.toString()}
        </button>
        <div
          style={{ left: activeTab === TestModeTabs.Standard ? "" : "50%" }}
          className="option-selected-bar"
        ></div>
      </div>
    </div>
  );
};

export default TestModeSelector;
