/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { CSSProperties, useEffect, useState, useRef } from "react";
import "./App.scss";
import TypingTest, { TypingTestProps } from "./components/TypingTest";
import TypingTestResults, { TypingTestResultsProps } from "./components/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import ResetButton, { ResetButtonProps } from "./components/ResetButton";
import TestOptions, { TestOptionsProps } from "./components/TestOptions";
import CompletionBar, { CompletionBarProps } from "./components/CompletionBar";
import WordsPerMinute, { WordsPerMinuteProps } from "./components/WordsPerMinute";
import CapsLockIndicator, { CapsLockIndicatorProps } from "./components/CapsLockIndicator";
import AfkDetectedIndicator, { AfkDetectedIndicatorProps } from "./components/AfkDetectedIndicator";
import { colourPalettes, ColourPaletteStructure } from "./interfaces/ColourPalletes";
import BottomBar, { BottomBarProps } from "./components/BottomBar";


export enum TestType {
	Words = "words",
	Time = "time"
}


export const TRANSITION_DELAY = 200;

function App() {

	const [testWords, setTestWords] = useState<TestWords>({words: [], errorCountHard: 0, errorCountSoft: 0, timeElapsedMilliSeconds: 0, characterCount: 0, keyPressCount: 0, rawWPMArray: [], currentAverageWPMArray: [], averageWPM: 0, accuracy: 0, testType: TestType.Words});
	const [testLengthWords, setTestLengthWords] = useState<number>(25);
	const [testLengthSeconds, setTestLengthSeconds] = useState<number>(15);
	const [testType, setTestType] = useState<TestType>(TestType.Words);
	const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
	const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);

	const [reset, setReset] = useState<boolean>(false);
	const [resetDivMargin, setResetDivMargin] = useState<string>("0rem");

	const [showResultsComponent, setShowResultsComponent] = useState<boolean>(false);
	const [resultsComponentOpacity, setResultsComponentOpacity] = useState<number>(0);
	const [resultsComponentDisplay, setResultsComponentDisplay] = useState<string>("none");

	const [testFocused, setTestFocused] = useState<boolean>(true);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testComplete, setTestComplete] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);

	const [testTimeMilliSeconds, setTestTimeMilliSeconds] = useState<number>(0);
	const [testCompletionPercentage, setTestCompletionPercentage] = useState<number>(0);
	const [pressedKeys, setPressedKeys] = useState<string[]>([]); 
	const [averageWPM, setAverageWPM] = useState<number>(0);

	const [WPMOpacity, setWPMOpacity] = useState<number>(0);
	const [WPMDisplay, setWPMDisplay] = useState<string>("block");

	const inputRef = useRef<HTMLInputElement>(null);
	const resetButtonRef = useRef<HTMLButtonElement>(null);

	const [capsLockOpacity, setCapsLockOpacity] = useState<number>(0);
	const currentWPM = averageWPM == null || isNaN(averageWPM) || !Number.isFinite(averageWPM) ? 0 : averageWPM;

	const [isAfkMidTest, setIsAfkMidTest] = useState<boolean>(false);

	const [selectedPalette, setSelectedPalette] = useState<ColourPaletteStructure>(colourPalettes[0]);

	const handleSiteKeyDown = (event: any) => {
		// prevent default tab functionality when test is not focused, set focus instead to the 'reset' button
		if (inputRef.current != document.activeElement) {
			if (event.type == "keydown" && event.key == "Tab") {
				//console.log("prevented tab");
				const tabKey = event as React.KeyboardEvent<HTMLInputElement>;
				tabKey.preventDefault();
				resetButtonRef.current!.focus();
			}
		}
		
		setCapsLockOpacity(event.getModifierState("CapsLock") ? 1 : 0);
	};
	

	//#region useEffects
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pressedKeys]);

	useEffect(() => {
		if (testComplete) { // show results, hide wpm, set opacity after delay
			setResultsComponentDisplay("block");
			setResetDivMargin("11rem");
			setShowResultsComponent(true);
			setWPMOpacity(0);
			setTimeout(() => {
				setResultsComponentOpacity(1);
			}, TRANSITION_DELAY + 100);
		}

		if (!testComplete) { // hide results, set display after delay
			setResetDivMargin("0rem");
			
			setResultsComponentOpacity(0);
			setTimeout(() => {
				setShowResultsComponent(false);
				setResultsComponentDisplay("none");
			}, TRANSITION_DELAY + 100);
		}
	}, [testComplete]);

	useEffect(() => {
		document.body.style.backgroundColor = selectedPalette?.backgroundColour;
	}, [selectedPalette]);
	//#endregion

	
	// moving the mouse while the test is running should show the test option selectors
	const handleMouseMove = () => {
		if (!testRunning) return;		
		setTestFocused(false);
		setComponentOpacity(1);
	};

	const colourPaletteStyling = {
		"--background-colour": selectedPalette.backgroundColour,
		"--base-font-colour": selectedPalette.baseFontColour,
		"--primary-highlight-colour": selectedPalette.primaryHighlightColour
	} as CSSProperties;

	//#region CSS Properties
	const opacityStyle = {
		"--component-opacity": componentOpacity,
		"--WPM-opacity": WPMOpacity,
		"--WPM-display": WPMDisplay,
		"--reset-div-margin": resetDivMargin,
		"--test-type-words-opacity": (testType === TestType.Words) ? 1 : 0,
		"--test-type-time-opacity": (testType === TestType.Time) ? 1 : 0,
	  } as CSSProperties;

	const completionBarWidth = {
		"--completion-percentage": testCompletionPercentage.toString() + "%"
	} as CSSProperties;

	const capsLockStyling = {
		"--capslock-opacity": testComplete ? 0 : capsLockOpacity
	} as CSSProperties;

	const resultsComponentStyling = {
		"--results-component-opacity": resultsComponentOpacity,
		"--results-component-display": resultsComponentDisplay
	} as CSSProperties;
	//#endregion

	//#region Component Props
	const afkDetectedIndicatorProps: AfkDetectedIndicatorProps = {
		isAfkMidTest
	};

	const testOptionsProps: TestOptionsProps = {
		opacityStyle, testType, setTestType, includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation, testLengthWords, setTestLengthWords, testLengthSeconds, setTestLengthSeconds
	};	

	const capsLockIndicatorProps: CapsLockIndicatorProps = {
		capsLockStyling
	};

	const completionBarProps: CompletionBarProps = {
		completionBarWidth
	};

	const typingTestProps: TypingTestProps = {
		testWords, setTestWords, testLengthWords, testLengthSeconds, testType, includeNumbers, includePunctuation, reset, setReset, inputRef, showResultsComponent, setShowResultsComponent, testRunning, setTestRunning, testTimeMilliSeconds, setTestTimeMilliSeconds, setTestCompletionPercentage, testComplete, setTestComplete, testFocused, setTestFocused, pressedKeys, setPressedKeys, averageWPM, setAverageWPM, setWPMOpacity, setComponentOpacity, setIsAfkMidTest
	};

	const typingTestResultsProps: TypingTestResultsProps = {
		testWords, setTestWords, showResultsComponent, resultsComponentStyling, selectedPalette
	};

	const wordsPerMinuteProps: WordsPerMinuteProps = {
		opacityStyle, currentWPM
	};

	const resetButtonProps: ResetButtonProps = {
		resetButtonRef, opacityStyle, reset, setReset, resultsComponentOpacity
	};

	const bottomBarProps: BottomBarProps = {
		selectedPalette, setSelectedPalette, opacityStyle
	};
	
	
	//#endregion

	return (
		<div style={colourPaletteStyling} className="App">
			<div className="main-container" onMouseMove={handleMouseMove}>
				<div className="inner-container">
					<AfkDetectedIndicator {...afkDetectedIndicatorProps}/>
					<TestOptions {...testOptionsProps}/>
					<CapsLockIndicator {...capsLockIndicatorProps} />
					<CompletionBar {...completionBarProps}/>		

					<div className="results-overlap-container">
						<TypingTest {...typingTestProps} />
						<TypingTestResults {...typingTestResultsProps}/>	
						<WordsPerMinute {...wordsPerMinuteProps}/>
					</div>
				</div>
				<ResetButton {...resetButtonProps}/>
				<BottomBar {...bottomBarProps}/>
			</div>
		</div>
   
	);
}

export default App;
