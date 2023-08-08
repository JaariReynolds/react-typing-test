import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";
import {TestType } from "../App";

export interface TestOptionsProps {
    opacityStyle: React.CSSProperties,
    testType: TestType,
    setTestType: React.Dispatch<React.SetStateAction<TestType>>,
    includeNumbers: boolean,
    setIncludeNumbers: React.Dispatch<React.SetStateAction<boolean>>,
    includePunctuation: boolean,
    setIncludePunctuation: React.Dispatch<React.SetStateAction<boolean>>,
    testLengthWords: number,
    setTestLengthWords: React.Dispatch<React.SetStateAction<number>>,
    testLengthSeconds: number,
    setTestLengthSeconds: React.Dispatch<React.SetStateAction<number>>,
   
}

const TestOptions = ({opacityStyle, testType, setTestType, includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation, testLengthWords, setTestLengthWords, testLengthSeconds, setTestLengthSeconds}: TestOptionsProps) => {
	return (
		<div className="test-options" style={opacityStyle}>
			<TestTypeSelector testType={testType} setTestType={setTestType}/>
			<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers}/>
			<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation}/>
			<TestLengthWordsSelector testLengthWords={testLengthWords} setTestLengthWords={setTestLengthWords} testType={testType}/>
			<TestLengthSecondsSelector testLengthSeconds={testLengthSeconds} setTestLengthSeconds={setTestLengthSeconds} testType={testType}/>
			
		</div>
	);
};

export default TestOptions;