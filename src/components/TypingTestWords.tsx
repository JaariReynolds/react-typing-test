/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { TestWords, CompletionStatus, Word } from "../interfaces/WordStructure";
import { calculateTestWordsDivOffset } from "../functions/calculations/calculateTestWordsDivOffset";

interface Props {
    testWords: TestWords,
	setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
    testRunning: boolean,
    testComplete: boolean,
    testFocused: boolean,
	inputWordsArray: string[],
	reset: boolean
	caretPosition: number,
	setCaretPosition: React.Dispatch<React.SetStateAction<number>>,
	currentInputWord: string
}

interface NumberPair {
    width: number,
    height: number
}

const TEST_WORDS_DIV_WIDTH_PERCENTAGE = 0.7;
const MAX_LINES = 3;
const MARGIN_RIGHT = 16;
let PADDING_BOTTOM = 0;


export const TypingTestWords = ({testWords, setTestWords, testRunning, testComplete, testFocused, inputWordsArray, reset, caretPosition, setCaretPosition, currentInputWord}: Props) => {

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
	}, [windowSize, testWords.characterCount]);

	// calculate the new end-of-line words and/or new caret position when screenwidth changes or if an extra letter is added/removed
	useEffect(() => {
		if (testWordObjectRef.current === null) return;

		if (testWords.words !== testWordsRef.current || windowSizeWidthRef.current !== windowSize.width) {
			//console.log("recalculating edge words and caret position");

			wordWidths.current.slice(0, testWords.words.length);
	
			// store lengths of each displayed word div - does not include the margin right yet
			testWordObjectRef.current.forEach((wordDiv, index) => {
				if (wordDiv) 
					wordWidths.current[index] = wordDiv.getBoundingClientRect().width;			
			});
	
			// store and calculate lengths of words up until the limit (div width)
			let lineWidthCurrentTotal = 0;
			let lineWidthTotalArray: number[] = [];
			//console.log(wordWidths);
			const finalLineIndexes = wordWidths.current.map((wordDiv, index) => {
				const wordWidth = wordDiv + MARGIN_RIGHT;
				
				// if new word + space can fit on the same line		
				if (lineWidthCurrentTotal + wordWidth <= windowSize.width * TEST_WORDS_DIV_WIDTH_PERCENTAGE) { // .width * 0.7 is because width of typingTestWords is 70% of window size (probably should put this in its own state eventually)
					lineWidthCurrentTotal += wordWidth; // add it to the current
				}
				// else if new word can't fit on the same line
				else { 
					lineWidthTotalArray = [...lineWidthTotalArray, lineWidthCurrentTotal - MARGIN_RIGHT]; // store the current total width minus the final margin width (spacebar at end of line)
					lineWidthCurrentTotal = wordWidth; // reset line starting with this word length
					return index - 1; /// add that index to the list 
				}
			}).slice(0, testWords.words.length);	
	
			// set isLastWordInLine for each word based on finalLineIndexes
			const newTestWords = testWords.words.map((word, wordIndex) => {
				if (finalLineIndexes.includes(wordIndex)) 
					return {...word, isLastWordInLine: true};			
				else 
					return {...word, isLastWordInLine: false};
			}); 
		
			const numSpannedLines = finalLineIndexes.reduce((total, index) => {
				if (index !== undefined && total !== undefined) 
					return total + 1;
				else 
					return total;
			}, 0);
			

			// store the widths of each letter in an array
			testWordIndividualLettersRef.current.forEach((letter, index) => {
				if (letter) 
					letterWidths.current[index] = letter.getBoundingClientRect().width;			
			});
	
			setTestWords({...testWords, words: newTestWords});	
			setActualLineWidths(lineWidthTotalArray.slice(0, numSpannedLines)); // set the newly calculated word line widths which the caret can move within

			windowSizeWidthRef.current = windowSize.width;
			testWordsRef.current = newTestWords;
		}
	}, [windowSize.width, testWords]);

	useEffect(() => {		
		// calculates how many lines the whole displayed word div + caret should move 
		let numOffsetLines = calculateTestWordsDivOffset(testWords.words);

		// basically, don't start scrolling the word div until we have finished typing the 2nd line of words, then scroll words and move caret such that the focused line will always be the middle one
		numOffsetLines = (numOffsetLines <= 1) ? 0 : numOffsetLines-1; 

		setOffsetLines(numOffsetLines);
		
		if (inputWordsArray.length === 0 && currentInputWord.length === 0 && testRunning) 
			setCaretPosition(0);		
		else 
			calculateCaretPosition();	
		
	}, [testWordsRef.current, testComplete]);

	// is called whenever testWords.words changes
	const calculateCaretPosition = () => {
		// get the number of letters that aren't LetterCompletionStatus type 'none'
		const currentLetterIndex = testWords.words
			.flatMap((letterArray) => [...letterArray.word])
			.reduce((totalCompletedLetters, letter) => {
				if (letter.status !== CompletionStatus.None) 
					return totalCompletedLetters + 1;
				else 
					return totalCompletedLetters;
			}, 0) - 1;		
		
		// gets number lines that have been 'submitted' aka caret line 
		const completedLastLineWords = testWords.words.reduce((total, word) => {
			if (word.isLastWordInLine && word.status !== CompletionStatus.None && !word.active)
				return total + 1;
			else
				return total;
		 }, 0);

		let currentDistanceCovered = 0;

		// get the total width of letter spans typed so far
		currentDistanceCovered = letterWidths.current
			.slice(0, currentLetterIndex + 1)
			.reduce((totalWidth, letterWidth) => totalWidth + letterWidth, 0)
			+ (inputWordsArray.length * MARGIN_RIGHT) // add in spaces between words
			- (completedLastLineWords * MARGIN_RIGHT); // remove spaces for last word in line
				
		setCurrentCaretLine(completedLastLineWords);
		
		const completedLineWidths = actualLineWidths
			.slice(0, completedLastLineWords)
			.reduce((total, line) => total + line, 0);
		
		currentDistanceCovered -= completedLineWidths;
		// set caret position accordingly
		setCaretPosition(currentDistanceCovered);	
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
		if (!testRunning || (testRunning && !testFocused)) {
			return "awaiting-input";
		}
		return "";
	};

	const testWordsStyling = {
		"--word-scroll-transition-property": wordScrollTransitionProperty,
		"--test-words-max-height": testWordsMaxHeight + "px",
		"--test-words-div-offset": -(offsetLines * testWordsMaxHeight / MAX_LINES) + "px"
	} as React.CSSProperties;

	const caretStyling = {
		"--caret-position": caretPosition + "px",
		"--caret-top-offset": (currentCaretLine === 0) ? "0rem" : 3 * currentCaretLine + "rem"
	} as React.CSSProperties;

	return (
		<>
			{/* <div className="debug">
				<div>
					current caret width: {caretPosition}
				</div>
				<div>
					current caret line is : {currentCaretLine}
				</div>
				<div>
					comparing to width of: {actualLineWidths[currentCaretLine]}
				</div>
			</div> */}
			<div style={testWordsStyling} ref={testWordsDivRef} className="words-container">
				<div style={caretStyling} className={`caret ${blinkingCaret()}`}></div>
				{testWords.words.map((word, wordIndex) => {
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

//${blinkingCaret(letter)} ${letterActive(letter.active)}