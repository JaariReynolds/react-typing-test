/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useRef } from "react";
import "./App.scss";
import TypingTest, { TypingTestProps } from "./components/TypingTest/TypingTest";
import TestResults, { TestResultsProps } from "./components/TestResults/TestResults";
import ResetButton, { ResetButtonProps } from "./components/Extras/ResetButton";
import TestOptions from "./components/TestOptions/TestOptions";
import CompletionBar from "./components/Extras/CompletionBar";
import WordsPerMinute, { WordsPerMinuteProps } from "./components/Extras/WordsPerMinute";
import CapsLockIndicator, { CapsLockIndicatorProps } from "./components/Extras/CapsLockIndicator";
import AfkDetectedIndicator, { AfkDetectedIndicatorProps } from "./components/Extras/AfkDetectedIndicator";
import Footer, { FooterProps } from "./components/Footer/Footer";
import KeyTips from "./components/Footer/KeyTips";
import ColourPaletteSelector, { ColourPaletteSelectorProps } from "./components/Extras/ColourPaletteSelector";
import UpdateCssVariable from "./components/HelperComponents/UpdateCssVariable";
import Header, { HeaderProps } from "./components/Header/Header";
import { useUserContext } from "./contexts/UserContext";
import { useTestInformationContext } from "./contexts/TestInformationContext";

export const TRANSITION_DELAY = 200;

function App() {
	const {isHeaderOpen, setIsHeaderOpen} = useUserContext();
	const {setShowResultsComponent} = useTestInformationContext();

	const isHeaderOpenRef = useRef<boolean>();
	isHeaderOpenRef.current = isHeaderOpen;

	const [reset, setReset] = useState<boolean>(false);
	const [resetDivMargin, setResetDivMargin] = useState<string>("0rem");

	const [resultsComponentOpacity, setResultsComponentOpacity] = useState<number>(0);
	const [resultsComponentDisplay, setResultsComponentDisplay] = useState<string>("none");

	const [testFocused, setTestFocused] = useState<boolean>(true);
	const [testRunning, setTestRunning] = useState<boolean>(false);
	const [testComplete, setTestComplete] = useState<boolean>(false);
	const [componentOpacity, setComponentOpacity] = useState<number>(1);

	const [pressedKeys, setPressedKeys] = useState<string[]>([]); 
	

	const [averageWPM, setAverageWPM] = useState<number>(0);

	const [WPMOpacity, setWPMOpacity] = useState<number>(0);
	const [WPMDisplay, setWPMDisplay] = useState<string>("block");

	const inputRef = useRef<HTMLInputElement>(null);
	const resetButtonRef = useRef<HTMLButtonElement>(null);

	const [capsLockOpacity, setCapsLockOpacity] = useState<number>(0);
	const currentWPM = averageWPM == null || isNaN(averageWPM) || !Number.isFinite(averageWPM) ? 0 : averageWPM;

	const [isAfkMidTest, setIsAfkMidTest] = useState<boolean>(false);
	const [showColourPalettes, setShowColourPalettes] = useState<boolean>(false);

	const colourPaletteDivRef = useRef<HTMLDivElement>(null);

	// need a ref of my ref just to use within an event listener :) 
	const showColourPaletteStateRef = useRef<boolean>(showColourPalettes);
	showColourPaletteStateRef.current = showColourPalettes;

	const headerRef = useRef<HTMLDivElement>(null);
	const [caretVisible, setCaretVisible] = useState<boolean>(true);

	UpdateCssVariable("--component-opacity", componentOpacity);
	UpdateCssVariable("--cursor-display", componentOpacity ? "auto" : "none");

	const handleSiteKeyDown = (event: KeyboardEvent) => {
		// prevent default tab functionality, set focus instead to the 'reset' button
		if (event.key == "Tab" && !isHeaderOpenRef.current) {
			event.preventDefault();
			resetButtonRef.current!.focus();
			setTestFocused(false);
			return;
		}

		// if reset button focused, can press "Esc" to set focus to test
		if (event.key == "Escape" && document.activeElement === resetButtonRef.current) {
			inputRef.current!.focus();
			setTestFocused(true);
			setComponentOpacity(0);
			return;
		}

		if (event.key === "CapsLock") {
			setCapsLockOpacity(event.getModifierState("CapsLock") ? 1 : 0);
			return;
		}
	};
	
	const handleOutsideClick = (event: any) => { 
		// if clicked outside of the colourPalette div when opened, close it
		if (showColourPaletteStateRef.current && colourPaletteDivRef.current && !colourPaletteDivRef.current.contains(event.target)) {
			setShowColourPalettes(!showColourPaletteStateRef.current);
		}
		
		// if clicked outside of header div when opened, close it
		else if (isHeaderOpenRef.current && headerRef.current && !headerRef.current.contains(event.target)) {
			setIsHeaderOpen(false);
		}

		// if clicked outside of input field, hide caret
		else if (inputRef.current && !inputRef.current.contains(event.target)) {
			setCaretVisible(false);
		}
	};

	//#region useEffects
	useEffect(() => {
		window.addEventListener("keydown", handleSiteKeyDown);
		window.addEventListener("mousedown", handleOutsideClick);

		return () => {
			window.removeEventListener("keydown", handleSiteKeyDown);
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
			setResetDivMargin("14rem");
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
		headerRef
	};

	const colourPaletteSelectorProps: ColourPaletteSelectorProps = {
		showColourPalettes, colourPaletteDivRef
	};

	const afkDetectedIndicatorProps: AfkDetectedIndicatorProps = {
		isAfkMidTest
	};

	const capsLockIndicatorProps: CapsLockIndicatorProps = {
		testComplete, capsLockOpacity
	};

	const typingTestProps: TypingTestProps = {
		reset, setReset, inputRef, testRunning, setTestRunning, testComplete, setTestComplete, testFocused, setTestFocused, pressedKeys, setPressedKeys, averageWPM, setAverageWPM, setWPMOpacity, setComponentOpacity, setIsAfkMidTest, caretVisible, setCaretVisible
	};

	const typingTestResultsProps: TestResultsProps = {
		resultsComponentOpacity, resultsComponentDisplay
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
				<div className="app-name">
					<img src={process.env.PUBLIC_URL + "/typi.png"} className="app-name-logo"/>
					typi
				</div>
				<img src={process.env.PUBLIC_URL + "/typi.png"} className="background-logo"/>
				<div className="inner-container">
					<AfkDetectedIndicator {...afkDetectedIndicatorProps}/>
					<TestOptions />
					<CapsLockIndicator {...capsLockIndicatorProps}/>
					<CompletionBar />		

					<div className="results-overlap-container">
						<TypingTest {...typingTestProps}/>
						<TestResults {...typingTestResultsProps}/>	
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
