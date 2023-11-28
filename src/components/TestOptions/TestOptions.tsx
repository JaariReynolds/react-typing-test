import React, { useEffect, useRef, useState } from "react";
import "./test-options.scss";
import StandardOptions from "./StandardOptions/StandardOptions";
import ModeOptions, { TestModeTabs } from "./ModeOptions/ModeOptions";
import TestModeSelector from "./TestModeSelector";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { TestMode, TestType } from "../../enums";

const TestOptions = () => {
	const [activeTab, setActiveTab] = useState<TestModeTabs>(localStorage.getItem("testModeTab") as TestModeTabs ?? TestModeTabs.Standard);
	const {testType, setTestType, testMode} = useTestInformationContext();

	const testTypeRef = useRef<TestType>(TestType.Time);
	const [wasAlphabetMode, setWasAlphabetMode] = useState<boolean>(false);
	
	// remember the testType before selecting alphabet mode (since alphabet mode forces testType.Words) - set back to this type when changing off alphabet mode
	useEffect(() => {
		if (testMode === TestMode.Alphabet) {
			setTestType(TestType.Words);
			setWasAlphabetMode(true);
			testTypeRef.current = testType;
			localStorage.setItem("testType", TestType.Words.toString());
		} 
		else if (wasAlphabetMode) {
			setTestType(testTypeRef.current);
			localStorage.setItem("testType", testTypeRef.current.toString());
			setWasAlphabetMode(false);
		}
	}, [testMode]);

	return (
		<div className="test-options-container">
			<TestModeSelector activeTab={activeTab} setActiveTab={setActiveTab}/>
			<div className="test-options">
				<StandardOptions />
				<ModeOptions activeTab={activeTab}/>
			</div>
		</div> 
	);
};

export default TestOptions;