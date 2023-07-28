import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";
import {TestType } from "../App";
import ColourPaletteSelector from "./ColourPaletteSelector";
import { ColourPaletteStructure } from "../interfaces/ColourPalletes";

interface testOptionsProps {
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
    selectedPalette: ColourPaletteStructure,
    setSelectedPalette: React.Dispatch<React.SetStateAction<ColourPaletteStructure>>
}

const TestOptions = ({opacityStyle, testType, setTestType, includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation, testLengthWords, setTestLengthWords, testLengthSeconds, setTestLengthSeconds, selectedPalette, setSelectedPalette}: testOptionsProps) => {
	return (
		<div className="test-options" style={opacityStyle}>
			<TestTypeSelector testType={testType} setTestType={setTestType}/>
			<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers}/>
			<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation}/>
			<TestLengthWordsSelector testLengthWords={testLengthWords} setTestLengthWords={setTestLengthWords} testType={testType}/>
			<TestLengthSecondsSelector testLengthSeconds={testLengthSeconds} setTestLengthSeconds={setTestLengthSeconds} testType={testType}/>
			<ColourPaletteSelector selectedPalette={selectedPalette} setSelectedPalette={setSelectedPalette}/>
		</div>
	);
};

export default TestOptions;