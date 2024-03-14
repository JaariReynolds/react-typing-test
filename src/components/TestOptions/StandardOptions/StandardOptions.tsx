import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestMode } from "../../../enums";

const StandardOptions = () => {
  const { testMode } = useTestInformationContext();

  return (
    <div
      className={`standard-options-container ${
        testMode === TestMode.Alphabet ? "disabled-container" : ""
      }`}
    >
      <TestTypeSelector />
      <TestLengthWordsSelector />
      <TestLengthSecondsSelector />
    </div>
  );
};

export default StandardOptions;
