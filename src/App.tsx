import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "./App.scss";
import TypingTest from "./components/TypingTest";
import TestTypeSelector from "./components/TestTypeSelector";
import TestLengthWordsSelector from "./components/TestLengthWordsSelector";
import TestLengthSecondsSelector from "./components/TestLengthSecondsSelector";
import PunctuationSelector from "./components/PunctuationSelector";
import NumberSelector from "./components/NumberSelector";
import TypingTestResults from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export enum TestType {
	Words = "Words",
	Time = "Time"
}
function App() {

	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0});
	const [testLengthWords, setTestLengthWords] = useState<number>(25);
	const [testLengthSeconds, setTestLengthSeconds] = useState<number>(15);
	const [testType, setTestType] = useState<TestType>(TestType.Words);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
	const [reset, setReset] = useState<boolean>(false);
	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testComplete, setTestComplete] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);

	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [testCompletionPercentage, setTestCompletionPercentage] = useState<number>(0);
	const [testFocused, setTestFocused] = useState<boolean>(true);
	const [pressedKeys, setPressedKeys] = useState<string[]>([]); // array because more than 1 key can be held down at once
	const [averageWPM, setAverageWPM] = useState<number>(0);
	const [WPMOpacity, setWPMOpacity] = useState<number>(0);

	// hide distracting components when test is running
	useEffect(() => {
		setComponentOpacity(testRunning ? 0 : 1);
		setWPMOpacity(testRunning ? 1 : 0);
	}, [testRunning]);

	// if moved mouse while test running, BUT then you still continue the test after, hide test option selectors again
	useEffect(() => {
		if (testFocused === false && testRunning && pressedKeys.length > 0) {
			setTestFocused(true);
			setComponentOpacity(0);
		}
	}, [pressedKeys]);

	// #region CSS properties
	const opacityStyle = {
		"--component-opacity": componentOpacity,
		"--WPM-opacity": WPMOpacity,
		"--test-type-words-opacity": (testType === TestType.Words && !testRunning) || (testRunning && testType === TestType.Words && testFocused === false && pressedKeys.length === 0) ? 1 : 0,
		"--test-type-time-opacity": (testType === TestType.Time && !testRunning) || (testRunning && testType === TestType.Time && testFocused === false && pressedKeys.length === 0) ? 1 : 0,
	  } as CSSProperties;

	const completionBarOpacity = {
		"--completion-percentage": testCompletionPercentage.toString() + "%"
	} as CSSProperties;

	const resultsComponentOpacity = {
		"--results-component-opacity": (showResultsComponent && testComplete) ? 1 : 0
	} as CSSProperties;
	// #endregion

	// moving the mouse while the test is running should show the test option selectors
	const handleMouseMove = () => {
		if (!testRunning) return;		
		setTestFocused(false);
		setComponentOpacity(1);
	};
	

	return (
		<div className="App">
			<div className="main-container" onMouseMove={handleMouseMove}>
				<div className="inner-container">
					<div className="top-gap"></div>
					<div>testcomplete={testComplete.toString()}</div>
					<div>testtime={testTimeMilliSeconds}</div>
					<div>testLength={testLengthSeconds}</div>
					<div>showResults={showResultsComponent.toString()}</div>
					<div>completionPercentage={testCompletionPercentage}</div>
					<div className="test-options">
						<TestTypeSelector testType={testType} setTestType={setTestType} opacityStyle={opacityStyle}/>

						<NumberSelector numbers={includeNumbers} setNumbers={setIncludeNumbers} opacityStyle={opacityStyle}/>
						<PunctuationSelector punctuation={includePunctuation} setPunctuation={setIncludePunctuation} opacityStyle={opacityStyle}/>
							
						<TestLengthWordsSelector testLengthWords={testLengthWords} setTestLengthWords={setTestLengthWords} opacityStyle={opacityStyle} testType={testType}/>

						<TestLengthSecondsSelector testLengthSeconds={testLengthSeconds} setTestLengthSeconds={setTestLengthSeconds} opacityStyle={opacityStyle} testType={testType}/>
					</div>
									
					<div style={completionBarOpacity} className="test-completion-bar"></div>
					
					<div className="results-overlap-container">
						<TypingTest testWords={testWords} setTestWords={setTestWords} testLengthWords={testLengthWords} testLengthSeconds={testLengthSeconds} testType={testType} numbers={includeNumbers} punctuation={includePunctuation} reset={reset} setShowResultsComponent={setShowResultsComponent} testRunning={testRunning} setTestRunning={setTestRunning} testTimeMilliSeconds={testTimeMilliSeconds} setTestTimeMilliSeconds={setTestTimeMilliSeconds} setTestCompletionPercentage={setTestCompletionPercentage}
							testComplete={testComplete} setTestComplete={setTestComplete} testFocused={testFocused} setTestFocused={setTestFocused} pressedKeys={pressedKeys} setPressedKeys={setPressedKeys} averageWPM={averageWPM} setAverageWPM={setAverageWPM} setWPMOpacity={setWPMOpacity}/>

						{ showResultsComponent && 
					<div style={resultsComponentOpacity} className="test-results-div">
						<TypingTestResults testWords={testWords} setTestWords={setTestWords} showResults={showResultsComponent}/>
					</div> }
					</div>

					<div style={opacityStyle} className="WPM-div">{averageWPM == null || isNaN(averageWPM) || !Number.isFinite(averageWPM) ? 0 : averageWPM}</div>
						
					<div className="reset-container">
						<button type="reset" title="Reset" style={opacityStyle} className="reset-button"
							onClick={() => setReset(!reset)}>
							<FontAwesomeIcon icon={faRefresh} className="fa-spin-custom"/>
						</button>
					</div>
				</div>
			</div>
		</div>
   
	);
}

export default App;
