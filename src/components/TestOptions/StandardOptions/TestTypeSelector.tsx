/* eslint-disable react/jsx-key */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { TestMode, TestType } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";

const TestTypeSelector = () => {
  const { testType, setTestType, testMode } = useTestInformationContext();

  const handleTabClick = (tab: TestType) => {
    setTestType(tab);
    localStorage.setItem("testType", tab);
  };

  return (
    <div
      style={{
        borderColor: testMode === TestMode.Alphabet ? "rgba(0, 0, 0, 0.2" : "",
      }}
      className="test-option-selector"
    >
      <div className="tab-selector">
        <button
          className={testType === TestType.Words ? "tab-selected" : ""}
          onClick={() => handleTabClick(TestType.Words)}
        >
          <FontAwesomeIcon
            icon={faFont}
            className="standard-icon-left words-icon"
          />
          {TestType.Words.toString()}
        </button>
        <button
          className={testType === TestType.Time ? "tab-selected" : ""}
          onClick={() => handleTabClick(TestType.Time)}
        >
          <FontAwesomeIcon icon={faClock} className="standard-icon-left" />
          {TestType.Time.toString()}
        </button>
        <div
          className="tab-selected-underline"
          style={{
            transform:
              testType === TestType.Words
                ? "translateX(0%)"
                : "translateX(100%)",
            borderColor:
              testMode === TestMode.Alphabet ? "rgba(0, 0, 0, 0.2" : "",
          }}
        ></div>
      </div>
    </div>
  );
};

export default TestTypeSelector;
