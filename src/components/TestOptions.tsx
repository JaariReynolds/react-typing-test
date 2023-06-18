import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";
import { TestType } from "../App";

interface Props {
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
    setTestLengthSeconds: React.Dispatch<React.SetStateAction<number>>

}

const TestOptions = ({opacityStyle, testType, setTestType, includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation, testLengthWords, setTestLengthWords, testLengthSeconds, setTestLengthSeconds}: Props) => {
	return (
		<div className="test-options">
			<TestTypeSelector testType={testType} setTestType={setTestType} opacityStyle={opacityStyle}/>

			<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers} opacityStyle={opacityStyle}/>
			<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation} opacityStyle={opacityStyle}/>
    
			<TestLengthWordsSelector testLengthWords={testLengthWords} setTestLengthWords={setTestLengthWords} opacityStyle={opacityStyle} testType={testType}/>

			<TestLengthSecondsSelector testLengthSeconds={testLengthSeconds} setTestLengthSeconds={setTestLengthSeconds} opacityStyle={opacityStyle} testType={testType}/>
		</div>
	);
};

export default TestOptions;