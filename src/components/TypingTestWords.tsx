/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { TestWords, Letter, LetterActiveStatus, CompletionStatus, Word } from "../interfaces/WordStructure";
import { calculateTestWordsDivOffset } from "../functions/calculations/calculateTestWordsDivOffset";

interface Props {
    testWords: TestWords,
	setTestWords: React.Dispatch<React.SetStateAction<TestWords>>,
    testRunning: boolean,
    testComplete: boolean,
    testFocused: boolean,
	potentialSpanShiftCount: number,
	inputWordsArray: string[],
	reset: boolean
}

interface NumberPair {
    width: number,
    height: number
}

const MAX_LINES = 3;
let PADDING_BOTTOM = 0;
const MARGIN_RIGHT = 16;


export const TypingTestWords = ({testWords, setTestWords, testRunning, testComplete, testFocused, potentialSpanShiftCount, inputWordsArray, reset}: Props) => {

	const testWordsDivRef = useRef<HTMLDivElement>(null);
	const testWordObjectRef = useRef<HTMLDivElement[]>([]);
	const testWordIndividualLettersRef = useRef<Array<HTMLSpanElement|null>>([]);
	testWordIndividualLettersRef.current = [];

	const [currentCharacterCount, setCurrentCharacterCount] = useState<number>(0);

	const letterWidths = useRef<number[]>([]);
	const spaceBarRef = useRef<number>(0); // related to inputWordsArray.length
	spaceBarRef.current = inputWordsArray.length;

	const wordWidths = useRef<number[]>([]);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);
	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});
	const [offsetLines, setOffsetLines] = useState<number>(0);
	const [wordScrollTransitionProperty, setWordScrollTransitionProperty] = useState<string>("top");

	const [caretPosition, setCaretPosition] = useState<number>(0); // in 'px' to determine 'left' property of css class

	const [actualLineWidths, setActualLineWidths] = useState<number[]>([]);
	const [currentCaretLine, setCurrentCaretLine] = useState<number>(0);
	const testwordsref = useRef<Word[]>([]);
	const counterRef = useRef(1);

	useEffect(() => {
		counterRef.current = 1;
		// setCaretPosition(0);
		// setCurrentCharacterCount(0);
		// setOffsetLines(0);
		// setActualLineWidths([]);

		console.log("testwords reset");
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
		setCaretPosition(0);
		setCurrentCharacterCount(0);
		setOffsetLines(0);
		setActualLineWidths([]);
		setCurrentCaretLine(0);
		counterRef.current = 0;

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
	}, [windowSize.height, testWords.characterCount]);

	// calculate the new end-of-line words when screenwidth changes or if an extra letter is added/removed
	useEffect(() => {
		if (testWordObjectRef.current === null) return;

		console.log("recalculating edge words");

		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);
		const divWidth = parseInt(computedStyle.getPropertyValue("width"), 10);
		wordWidths.current.slice(0, testWords.words.length);

		testWordObjectRef.current.forEach((word, index) => {
			if (word)
				wordWidths.current[index] = word.getBoundingClientRect().width;
		});

		// store and calculate lengths of words up until the limit (div width)
		let lineWidthCurrentTotal = 0;
		let lineWidthTotalArray: number[] = [];
		const finalLineIndexes = wordWidths.current.map((wordDiv, index) => {
			const wordWidth = wordDiv + MARGIN_RIGHT;
			
			if (lineWidthCurrentTotal + wordWidth <= divWidth) { // if new word can fit on the same line		
				lineWidthCurrentTotal += wordWidth; // add it to the current
			}
			else { // if new word can't fit on the same line
				lineWidthTotalArray = [...lineWidthTotalArray, lineWidthCurrentTotal - 16]; 
				//console.log("current line width total is " + lineWidthCurrentTotal);
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

		setActualLineWidths(lineWidthTotalArray.slice(0, numSpannedLines));
		//console.log(lineWidthTotalArray);
		setTestWords({...testWords, words: newTestWords});

	}, [potentialSpanShiftCount, windowSize.width]);


	useEffect(() => {
		counterRef.current += 1;
		console.log(counterRef.current);
		//if (!testRunning && counterRef.current !== 1) return;
	
		console.log(testWords.words);
		
		let numOffsetLines = calculateTestWordsDivOffset(testWords.words);
		if (numOffsetLines == 1) numOffsetLines = 0;
		else if (numOffsetLines > 1) numOffsetLines -=1;
		setOffsetLines(numOffsetLines);
		console.log("test");
		// console.log("effect ran");
		// console.log(testWords.words);
		// if a new character has been added, update character count for caret 
		if (currentCharacterCount !== testWords.characterCount - (testWords.words.length - 1)) {
			setCurrentCharacterCount(testWords.characterCount - (testWords.words.length - 1));
			testWordIndividualLettersRef.current = testWordIndividualLettersRef.current.slice(0, testWords.characterCount - (testWords.words.length - 1));
		}

		// store the widths of each letter in an array
		testWordIndividualLettersRef.current.forEach((letter, index) => {
			if (letter) 
				letterWidths.current[index] = letter.getBoundingClientRect().width;			
		});

		// get the number of letters that aren't LetterCompletionStatus type 'none'
		const currentLetterIndex = testWords.words
			.flatMap((letterArray) => [...letterArray.word])
			.reduce((totalCompletedLetters, letter) => {
				if (letter.status !== CompletionStatus.None) {
					return totalCompletedLetters + 1;
				}
				return totalCompletedLetters;
			}, 0) - 1;

		//console.log("currently completed letter index is " + currentLetterIndex);
		
		
		// get the total width of letter spans typed so far
		let currentDistanceCovered = letterWidths.current
			.slice(0, currentLetterIndex + 1)
			.reduce((totalWidth, letter) => totalWidth + letter, 0)
		+ (inputWordsArray.length * 16);
		
		// account for dynamic line widths as letters are spanned across multiple lines
		const completedLineWidths = actualLineWidths
			.slice(0, currentCaretLine)
			.reduce((total, line) => total + line, 0);

		//console.log("completed line widths:" + completedLineWidths);

		if (currentCaretLine !== 0) {
			currentDistanceCovered -= (completedLineWidths + (16 * currentCaretLine));
		}
		
		// add 0.5 safety net to avoid inaccuracies with decimals
		if (currentDistanceCovered > actualLineWidths[currentCaretLine] + 0.5) {
			console.log("current distant would have been " + currentDistanceCovered);
			setCurrentCaretLine(currentCaretLine + 1);
			setCaretPosition(0);
			return;
			//currentDistanceCovered = completedLineWidths;
		}

		// set caret position accordingly
		setCaretPosition(currentDistanceCovered);	
		

	}, [testWords.words]);

	




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

	const letterActive = (activeStatus: LetterActiveStatus) => {
		if (testComplete) return ""; // hide caret when test finished

		switch (activeStatus) {
		case LetterActiveStatus.Active:
			return "active";
		case LetterActiveStatus.Inactive:
			return "";
		case LetterActiveStatus.ActiveLast:
			return "active-last";
		}
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
			{/* <div>
			testWordsMaxHeight = {offsetLines * testWordsMaxHeight / MAX_LINES}
			</div> */}
			{/* <div>
				lastWords: {testWords.words.map(word => {
					return (
						<div>word: {word.isLastWordInLine.toString()}</div>
					);
				})}
			</div> */}
			<div className="debug">
				<div>
					current caret width: {caretPosition}
				</div>
				<div>
					current caret line is : {currentCaretLine}
				</div>
				<div>
					comparing to width of: {actualLineWidths[currentCaretLine]}
				</div>
			</div>
			<div style={testWordsStyling} ref={testWordsDivRef} className="words-container">
				<div style={caretStyling} className={`caret ${blinkingCaret()}`}></div>
				{testWords.words.map((word, wordIndex) => {
					return (
						<div key={wordIndex} className="word" ref={(wordRef) => (testWordObjectRef.current[wordIndex] = wordRef as HTMLDivElement)}>
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