/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useRef } from "react";
import "./App.scss";
import TypingTest, { TypingTestProps } from "./components/TypingTest/TypingTest";
import TypingTestResults, { TypingTestResultsProps } from "./components/TestResults/TypingTestResults";
import { TestWords } from "./interfaces/WordStructure";
import ResetButton, { ResetButtonProps } from "./components/ResetButton";
import TestOptions, { TestOptionsProps } from "./components/TestOptions/TestOptions";
import CompletionBar, { CompletionBarProps } from "./components/CompletionBar";
import WordsPerMinute, { WordsPerMinuteProps } from "./components/WordsPerMinute";
import CapsLockIndicator, { CapsLockIndicatorProps } from "./components/CapsLockIndicator";
import AfkDetectedIndicator, { AfkDetectedIndicatorProps } from "./components/AfkDetectedIndicator";
import Footer, { FooterProps } from "./components/Footer";
import KeyTips from "./components/KeyTips";
import ColourPaletteSelector, { ColourPaletteSelectorProps } from "./components/ColourPaletteSelector";

import UpdateCssVariable from "./components/HelperComponents/UpdateCssVariable";
import UpdateCssVariablePaletteObject from "./components/HelperComponents/UpdateCssVariablePaletteObject";
import Header, { HeaderProps } from "./components/Header/Header";

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
	const sitePressedKeysRef = useRef<Set<string>>(new Set());


	const [averageWPM, setAverageWPM] = useState<number>(0);

	const [WPMOpacity, setWPMOpacity] = useState<number>(0);
	const [WPMDisplay, setWPMDisplay] = useState<string>("block");

	const inputRef = useRef<HTMLInputElement>(null);
	const resetButtonRef = useRef<HTMLButtonElement>(null);

	const [capsLockOpacity, setCapsLockOpacity] = useState<number>(0);
	const currentWPM = averageWPM == null || isNaN(averageWPM) || !Number.isFinite(averageWPM) ? 0 : averageWPM;

	const [isAfkMidTest, setIsAfkMidTest] = useState<boolean>(false);

	const [selectedPaletteId, setSelectedPaletteId] = useState<number>(0);
	const [showColourPalettes, setShowColourPalettes] = useState<boolean>(false);

	const colourPaletteDivRef = useRef<HTMLDivElement>(null);

	// need a ref of my ref just to use within an event listener :) 
	const showColourPaletteStateRef = useRef<boolean>(showColourPalettes);
	showColourPaletteStateRef.current = showColourPalettes;

	const headerExpandedRef = useRef<boolean>(false);
	const headerRef = useRef<HTMLDivElement>(null);
	const [headerHeight, setHeaderHeight] = useState<string>("2.5rem");


	UpdateCssVariablePaletteObject(selectedPaletteId);
	UpdateCssVariable("--component-opacity", componentOpacity);

	const handleSiteKeyDown = (event: KeyboardEvent) => {
		// prevent default tab functionality, set focus instead to the 'reset' button
		if (event.key == "Tab") {
			event.preventDefault();
			resetButtonRef.current!.focus();
			return;
		}

		setCapsLockOpacity(event.getModifierState("CapsLock") ? 1 : 0);

		if (sitePressedKeysRef.current.has(event.key))
			return;

		sitePressedKeysRef.current = new Set([...sitePressedKeysRef.current, event.key]);

		handleSiteKeyCombos();
	};

	const handleSiteKeyUp = (event: KeyboardEvent) => {
		if (sitePressedKeysRef.current.has(event.key)) {
			const newSitePressedKeys = new Set(sitePressedKeysRef.current);
			newSitePressedKeys.delete(event.key);
			sitePressedKeysRef.current = newSitePressedKeys;
		}
	};

	
	const handleOutsideClick = (event: any) => { // if clicked outside of the colourPalette div when opened, close it
		if (showColourPaletteStateRef.current && colourPaletteDivRef.current && !colourPaletteDivRef.current.contains(event.target)) {
			setShowColourPalettes(!showColourPaletteStateRef.current);
		}
		// if clicked outside of header div when opened, close it
		else if (headerRef.current && headerExpandedRef.current && !headerRef.current.contains(event.target)) {
			headerExpandedRef.current = !headerExpandedRef.current;
			setHeaderHeight(headerExpandedRef.current ? "15rem" : "2.5rem");

		}
	};

	const handleSiteKeyCombos = () => {
		// shortcut: ctrl + q to show themes overlay
		if (sitePressedKeysRef.current.has("Control") && sitePressedKeysRef.current.has("q") && inputRef.current) { 
			if (!showColourPaletteStateRef.current) {
				console.log("test blurred");
				setShowColourPalettes(true);
				return;
			}
			else if (showColourPaletteStateRef.current && inputRef.current) { // give focus to input field once closed
				setShowColourPalettes(false);
				inputRef.current.focus();
				return;
			}
		}
	};

	//#region useEffects
	useEffect(() => {
		window.addEventListener("keydown", handleSiteKeyDown);
		window.addEventListener("keyup", handleSiteKeyUp);
		window.addEventListener("mousedown", handleOutsideClick);

		return () => {
			window.removeEventListener("keydown", handleSiteKeyDown);
			window.removeEventListener("keyup", handleSiteKeyUp);
			window.removeEventListener("mousedown", handleOutsideClick);
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
	//#endregion
	
	// moving the mouse while the test is running should show the test option selectors
	const handleMouseMove = () => {
		if (!testRunning) return;		
		setTestFocused(false);
		setComponentOpacity(1);
	};

	//#region Component Props
	const headerProps: HeaderProps = {
		headerRef, headerExpandedRef, headerHeight, setHeaderHeight
	};

	const colourPaletteSelectorProps: ColourPaletteSelectorProps = {
		selectedPaletteId, setSelectedPaletteId, showColourPalettes, colourPaletteDivRef
	};

	const afkDetectedIndicatorProps: AfkDetectedIndicatorProps = {
		isAfkMidTest
	};

	const testOptionsProps: TestOptionsProps = {
		testType, setTestType, includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation, testLengthWords, setTestLengthWords, testLengthSeconds, setTestLengthSeconds
	};	

	const capsLockIndicatorProps: CapsLockIndicatorProps = {
		testComplete, capsLockOpacity
	};

	const completionBarProps: CompletionBarProps = {
		testCompletionPercentage
	};

	const typingTestProps: TypingTestProps = {
		testWords, setTestWords, testLengthWords, testLengthSeconds, testType, includeNumbers, includePunctuation, reset, setReset, inputRef, showResultsComponent, setShowResultsComponent, testRunning, setTestRunning, testTimeMilliSeconds, setTestTimeMilliSeconds, setTestCompletionPercentage, testComplete, setTestComplete, testFocused, setTestFocused, pressedKeys, setPressedKeys, averageWPM, setAverageWPM, setWPMOpacity, setComponentOpacity, setIsAfkMidTest
	};

	const typingTestResultsProps: TypingTestResultsProps = {
		testWords, setTestWords, showResultsComponent, selectedPaletteId, resultsComponentOpacity, resultsComponentDisplay
	};

	const wordsPerMinuteProps: WordsPerMinuteProps = {
		currentWPM, WPMOpacity, WPMDisplay
	};

	const resetButtonProps: ResetButtonProps = {
		resetButtonRef, reset, setReset, resultsComponentOpacity, resetDivMargin
	};

	const footerProps: FooterProps = {
		setShowColourPalettes, colourPaletteDivRef
	};
	//#endregion

	return (
		<div className="App">
			<div className="main-container" onMouseMove={handleMouseMove}>
				<Header {...headerProps}/>
				<div className="inner-container">
					<AfkDetectedIndicator {...afkDetectedIndicatorProps}/>
					<TestOptions {...testOptionsProps}/>
					<CapsLockIndicator {...capsLockIndicatorProps}/>
					<CompletionBar {...completionBarProps}/>		

					<div className="results-overlap-container">
						<TypingTest {...typingTestProps}/>
						<TypingTestResults {...typingTestResultsProps}/>	
						<WordsPerMinute {...wordsPerMinuteProps}/>
					</div>

					<ResetButton {...resetButtonProps}/>
				</div>

				<KeyTips />
				<ColourPaletteSelector {...colourPaletteSelectorProps}/>

				<Footer {...footerProps}/>
			</div>
		</div>
   
	);
}

export default App;
