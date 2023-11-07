/* eslint-disable react/jsx-key */
import "./typing-test-words.scss";
import React, { useEffect, useRef, useState } from "react";
import { CompletionStatus, Word } from "../../interfaces/WordStructure";
import UpdateCssVariable from "../HelperComponents/UpdateCssVariable";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { calculateCaretLine } from "../../functions/calculations/calculateCaretLine";
import { calculateCurrentLetterIndex } from "../../functions/calculations/calculateCurrentLetterIndex";
import { calculateCurrentDistanceCovered } from "../../functions/calculations/calculateCurrentDistanceCovered";
import { calculateLastWordsPerLine } from "../../functions/calculations/calculateLastWordsPerLine";
import { calculateNumberOfSpannedLines } from "../../functions/calculations/calculateNumberOfSpannedLines";

export interface TypingTestWordsProps {
    testRunning: boolean,
    testComplete: boolean,
    testFocused: boolean,
	inputWordsArray: string[],
	reset: boolean
	caretPosition: number,
	setCaretPosition: React.Dispatch<React.SetStateAction<number>>,
	currentInputWord: string,
	inputRef: React.RefObject<HTMLInputElement>,
	opacity: number,
	caretVisible: boolean
}

interface NumberPair {
    width: number,
    height: number
}

const TEST_WORDS_DIV_WIDTH_PERCENTAGE = 0.7;
const MAX_LINES = 3;
const MARGIN_RIGHT = 20;
let PADDING_BOTTOM = 0;


export const TypingTestWords = ({testRunning, testComplete, testFocused, inputWordsArray, reset, caretPosition, setCaretPosition, currentInputWord, inputRef, opacity, caretVisible}: TypingTestWordsProps) => {
	const {testInformation, setTestInformation} = useTestInformationContext();
	const testWordsRef = useRef<Word[]>();

	const testWordsDivRef = useRef<HTMLDivElement>(null);
	const testWordObjectRef = useRef<HTMLDivElement[]>([]);
	const testWordIndividualLettersRef = useRef<Array<HTMLSpanElement|null>>([]);
	testWordIndividualLettersRef.current = [];

	const letterWidths = useRef<number[]>([]);
	const spaceBarRef = useRef<number>(0); // related to inputWordsArray.length
	spaceBarRef.current = inputWordsArray.length;

	const wordWidths = useRef<number[]>([]);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);

	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});
	const windowSizeWidthRef = useRef<number>();

	const [offsetLines, setOffsetLines] = useState<number>(0);
	const [wordScrollTransitionProperty, setWordScrollTransitionProperty] = useState<string>("top");


	const [actualLineWidths, setActualLineWidths] = useState<number[]>([]);
	const [currentCaretLine, setCurrentCaretLine] = useState<number>(0);

	UpdateCssVariable("--word-scroll-transition-property", wordScrollTransitionProperty);
	UpdateCssVariable("--test-words-max-height", testWordsMaxHeight + "px");

	const wordsContainerStyling = {
		top: -(offsetLines * testWordsMaxHeight / MAX_LINES) + "px",
		opacity: opacity
	} as React.CSSProperties;

	const caretStyling = {
		left: caretPosition + "px",
		top: (currentCaretLine === 0) ? "0rem" : 3 * currentCaretLine + "rem",
		opacity: caretVisible ? 1 : 0
	} as React.CSSProperties;

	useEffect(() => {
		// grab css sizing properties on mount
		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);

		PADDING_BOTTOM = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
		
		// add listener to window size
		const handleResize = () => {
			setWindowSize({width: window.innerWidth, height: window.innerHeight});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		setOffsetLines(0);
		setActualLineWidths([]);
		setCurrentCaretLine(0);
		setCaretPosition(0);
	}, [reset]);

	useEffect(() => {
		if (testRunning) setWordScrollTransitionProperty("top");
		else setWordScrollTransitionProperty("bottom");
	}, [testRunning]);

	// only check to change test height when window height is changed
	useEffect(() => {
		const computedStyle = window.getComputedStyle(testWordsDivRef.current!); 
		const lineHeight = parseInt(computedStyle.getPropertyValue("line-height"), 10);
		const currentTestWordsMaxHeight = (lineHeight * MAX_LINES) + PADDING_BOTTOM;
		setTestWordsMaxHeight(currentTestWordsMaxHeight);
	}, [windowSize, testInformation.characterCount]);

	// calculate the new end-of-line words and/or new caret position when screenwidth changes or if an extra letter is added/removed
	useEffect(() => {
		if (testWordObjectRef.current === null) return;

		if (testInformation.words !== testWordsRef.current || windowSizeWidthRef.current !== windowSize.width) {
			wordWidths.current.slice(0, testInformation.words.length);
	
			// store lengths of each displayed word div - does not include the margin right yet
			testWordObjectRef.current.forEach((wordDiv, index) => {
				if (wordDiv) 
					wordWidths.current[index] = wordDiv.getBoundingClientRect().width;			
			});
	
			// store and calculate lengths of words up until the limit (div width)
			let lineWidthCurrentTotal = 0;
			let lineWidthTotalArray: number[] = [];
			
			const finalLineIndexes = wordWidths.current.map((wordDiv, index) => {
				const wordWidth = wordDiv + MARGIN_RIGHT;
				
				// if new word + space can fit on the same line		
				if (lineWidthCurrentTotal + wordWidth <= windowSize.width * TEST_WORDS_DIV_WIDTH_PERCENTAGE) { 
					lineWidthCurrentTotal += wordWidth; // add it to the current
				}
				else { 
					lineWidthTotalArray = [...lineWidthTotalArray, lineWidthCurrentTotal - MARGIN_RIGHT]; // store the current total width minus the final margin width (spacebar at end of line)
					lineWidthCurrentTotal = wordWidth; // reset line starting with this word length
					return index - 1; /// add that index to the list 
				}
			}).slice(0, testInformation.words.length);	
	
			// set isLastWordInLine for each word based on finalLineIndexes
			const newTestWords = calculateLastWordsPerLine(testInformation.words, finalLineIndexes);
			const numSpannedLines = calculateNumberOfSpannedLines(finalLineIndexes);
		
			// store the widths of each letter in an array
			testWordIndividualLettersRef.current.forEach((letter, index) => {
				if (letter) 
					letterWidths.current[index] = letter.getBoundingClientRect().width;			
			});
	
			setTestInformation({...testInformation, words: newTestWords});	
			setActualLineWidths(lineWidthTotalArray.slice(0, numSpannedLines)); // set the newly calculated word line widths which the caret can move within

			windowSizeWidthRef.current = windowSize.width;
			testWordsRef.current = newTestWords;
		}
	}, [windowSize.width, testInformation]);

	useEffect(() => {		
		const caretLine = calculateCaretLine(testInformation.words);
		
		// don't start scrolling the word div until we have finished typing the 2nd line of words, then scroll words and move caret such that the focused line will always be the middle one
		const numOffsetLines = (caretLine <= 1) ? 0 : caretLine - 1; 
		setOffsetLines(numOffsetLines);
		
		if (inputWordsArray.length === 0 && currentInputWord.length === 0 && testRunning) 
			// needed otherwise the caret reset will stutter while waiting for the testWordsRef to fully reset 
			setCaretPosition(0);		
		else 
			calculateCaretPosition(caretLine);	
		
		// testComplete included in dependencies so that the caret moves on the final letter that completes the test
	}, [testWordsRef.current, testComplete]);

	// is called whenever testInformation.words changes
	const calculateCaretPosition = (calculatedCaretLine: number) => {
		const currentLetterIndex =	calculateCurrentLetterIndex(testInformation.words);
		const caretLine = calculatedCaretLine;
		const currentDistanceCovered = calculateCurrentDistanceCovered(currentLetterIndex, MARGIN_RIGHT, caretLine, letterWidths.current, inputWordsArray, actualLineWidths);

		// set caret position accordingly
		setCaretPosition(currentDistanceCovered);	
		setCurrentCaretLine(caretLine);
	};

	const addToLetterRefs = (letterSpan: any) => {
		if (letterSpan && !testWordIndividualLettersRef.current.includes(letterSpan)) {
			testWordIndividualLettersRef.current.push(letterSpan);
		}
	};
	
	const letterColour = (completionStatus: CompletionStatus) => {
		switch (completionStatus) {
		case CompletionStatus.None:
			return "base-text-colour";
		case CompletionStatus.Correct:
			return "correct-text-colour";
		case CompletionStatus.Incorrect:
			return "incorrect-text-colour";
		} 
	};

	const lastWordInLine = (word: Word) => { // DEBUG ONLY 
		// if (word.isLastWordInLine) return "last-word-in-line";
		// else return "";
		return "";
	};

	const blinkingCaret = () => {
		// (if test not running and input field focused) OR (test running and input field focused but moved mouse during test)
		if ((!testRunning && inputRef.current && document.activeElement === inputRef.current) || (testRunning && inputRef.current && document.activeElement === inputRef.current && !testFocused))
			return "awaiting-input";
		
		return "";
	};

	return (
		<>			
			<div style={wordsContainerStyling} ref={testWordsDivRef} className="words-container">
				<div style={caretStyling} className={`caret ${blinkingCaret()}`}></div>
				{testInformation.words.map((word, wordIndex) => {
					return (
						<div key={wordIndex} className={`word ${lastWordInLine(word)}`} ref={(wordRef) => (testWordObjectRef.current[wordIndex] = wordRef as HTMLDivElement)}>
							{word.word.map((letter, letterIndex) => {
								return (
									<span 
										key={letterIndex} 
										className={`letter ${letterColour(letter.status)}`} 
										ref={addToLetterRefs}
									>
										{letter.letter}
									</span>
								);}
							)}
						</div> 
					);
				})}
			</div>		
		</>		
	);
};