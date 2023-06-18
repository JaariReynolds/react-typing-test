import React, { CSSProperties, useEffect, useState, useRef } from "react";
import "./App.scss";
import TypingTest from "./components/TypingTest";
import TypingTestResults from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import ResetButton from "./components/ResetButton";
import TestOptions from "./components/TestOptions";
import CompletionBar from "./components/CompletionBar";
import WordsPerMinute from "./components/WordsPerMinute";


export enum TestType {
	Words = "Words",
	Time = "Time"
}
export const TRANSITION_DELAY = 200;

function App() {

	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0});
	const [testLengthWords, setTestLengthWords] = useState<number>(25);
	const [testLengthSeconds, setTestLengthSeconds] = useState<number>(15);
	const [testType, setTestType] = useState<TestType>(TestType.Words);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);

	const [reset, setReset] = useState<boolean>(false);
	const [resetDivMargin, setResetDivMargin] = useState<string>("0px");

	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [resultsComponentOpacity, setResultsComponentOpacity] = useState<number>(0);
	const [resultsComponentDisplay, setResultsComponentDisplay] = useState<string>("none");

	const [testFocused, setTestFocused] = useState<boolean>(true);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testComplete, setTestComplete] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);

	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [testCompletionPercentage, setTestCompletionPercentage] = useState<number>(0);
	const [pressedKeys, setPressedKeys] = useState<string[]>([]); // array because more than 1 key can be held down at once
	const [averageWPM, setAverageWPM] = useState<number>(0);

	const [WPMOpacity, setWPMOpacity] = useState<number>(0);
	const [WPMDisplay, setWPMDisplay] = useState<string>("block");

	const inputRef = useRef<HTMLInputElement>(null);
	const resetButtonRef = useRef<HTMLButtonElement>(null);

	
	const handleSiteKeyDown = (event: any) => {
		// prevent default tab functionality when test is not focused, set focus instead to the 'reset' button
		if (inputRef.current != document.activeElement) {
			if (event.type == "keydown" && event.key == "Tab") {
				console.log("prevented tab");
				const tabKey = event as React.KeyboardEvent<HTMLInputElement>;
				tabKey.preventDefault();
				resetButtonRef.current!.focus();
			}
		}
	};

	useEffect(() => {
			
		
		window.addEventListener("keydown", handleSiteKeyDown);

		return () => {
			window.removeEventListener("keydown", handleSiteKeyDown);
		};
	}, []);

	// hide distracting components when test is running
	useEffect(() => {
		setComponentOpacity(testRunning ? 0 : 1);
		if (testRunning) {
			setWPMDisplay("block");
			setWPMOpacity(1);
		}
		else {
			setWPMDisplay("none");
		}
		//setWPMOpacity(testRunning ? 1 : 0);
	}, [testRunning]);

	// if moved mouse while test running, BUT then you still continue the test after, hide test option selectors again
	useEffect(() => {
		if (testFocused === false && testRunning && pressedKeys.length > 0) {
			setTestFocused(true);
			setComponentOpacity(0);
		}
	}, [pressedKeys]);

	useEffect(() => {
		if (testComplete) { // show results, hide wpm, set opacity after delay
			setResultsComponentDisplay("block");
			setResetDivMargin("144px");
			setShowResultsComponent(true);
			setWPMOpacity(0);
			setTimeout(() => {
				setResultsComponentOpacity(1);
			}, TRANSITION_DELAY + 100);
		}

		if (!testComplete) { // hide results, set display after delay
			setShowResultsComponent(false);
			setResetDivMargin("0px");

			setResultsComponentOpacity(0);
			setTimeout(() => {
				setResultsComponentDisplay("none");
			}, TRANSITION_DELAY + 100);
		}
	}, [testComplete]);

	const currentWPM = averageWPM == null || isNaN(averageWPM) || !Number.isFinite(averageWPM) ? 0 : averageWPM;
	
	// #region CSS properties
	const opacityStyle = {
		"--component-opacity": componentOpacity,
		"--WPM-opacity": WPMOpacity,
		"--WPM-display": WPMDisplay,
		"--reset-div-margin": resetDivMargin,
		"--test-type-words-opacity": (testType === TestType.Words && !testRunning) || (testRunning && testType === TestType.Words && testFocused === false && pressedKeys.length === 0) ? 1 : 0,
		"--test-type-time-opacity": (testType === TestType.Time && !testRunning) || (testRunning && testType === TestType.Time && testFocused === false && pressedKeys.length === 0) ? 1 : 0,
		
	  } as CSSProperties;

	const completionBarOpacity = {
		"--completion-percentage": testCompletionPercentage.toString() + "%"
	} as CSSProperties;

	const resultsComponentStyling = {
		"--results-component-opacity": resultsComponentOpacity,
		"--results-component-display": resultsComponentDisplay
	} as CSSProperties;
	//#endregion;

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
					{/* <div>testcomplete={testComplete.toString()}</div>
					<div>testtime={testTimeMilliSeconds}</div>
					<div>testLength={testLengthSeconds}</div>
					<div>showResults={showResultsComponent.toString()}</div>
					<div>completionPercentage={testCompletionPercentage}</div>
					<div>reset={reset.toString()}</div> */}
					<div>testFocused:{testFocused.toString()}</div>
					<div>resetDivMargin: {resetDivMargin}</div>

					<TestOptions 
						opacityStyle={opacityStyle} testType={testType} setTestType={setTestType} includeNumbers={includeNumbers} setIncludeNumbers={setIncludeNumbers} includePunctuation={includePunctuation} setIncludePunctuation={setIncludePunctuation} testLengthWords={testLengthWords} setTestLengthWords={setTestLengthWords} testLengthSeconds={testLengthSeconds} setTestLengthSeconds={setTestLengthSeconds}
					/>

					<CompletionBar completionBarOpacity={completionBarOpacity}/>		

					<div className="results-overlap-container">
						
						<TypingTest testWords={testWords} setTestWords={setTestWords} testLengthWords={testLengthWords} testLengthSeconds={testLengthSeconds} testType={testType} numbers={includeNumbers} punctuation={includePunctuation} reset={reset} inputRef={inputRef} showResultsComponent={showResultsComponent} setShowResultsComponent={setShowResultsComponent} testRunning={testRunning} setTestRunning={setTestRunning} testTimeMilliSeconds={testTimeMilliSeconds} setTestTimeMilliSeconds={setTestTimeMilliSeconds} setTestCompletionPercentage={setTestCompletionPercentage}
							testComplete={testComplete} setTestComplete={setTestComplete} testFocused={testFocused} setTestFocused={setTestFocused} pressedKeys={pressedKeys} setPressedKeys={setPressedKeys} averageWPM={averageWPM} setAverageWPM={setAverageWPM} setWPMOpacity={setWPMOpacity} setComponentOpacity={setComponentOpacity}/>
						
						
						<TypingTestResults testWords={testWords} setTestWords={setTestWords} showResults={showResultsComponent} styling={resultsComponentStyling}/>
						
						<WordsPerMinute WPMOpacity={opacityStyle} currentWPM={currentWPM}/>
					</div>

					<ResetButton buttonRef={resetButtonRef} opacityStyle={opacityStyle} reset={reset} setReset={setReset} resultsComponentOpacity={resultsComponentOpacity}/>
					
				</div>
			</div>
		</div>
   
	);
}

export default App;
