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
	currentInputWord: string
}

interface NumberPair {
    width: number,
    height: number
}

const MAX_LINES = 3;
let PADDING_BOTTOM = 0;
const MARGIN_RIGHT = 16;


export const TypingTestWords = ({testWords, setTestWords, testRunning, testComplete, testFocused, potentialSpanShiftCount, inputWordsArray, currentInputWord}: Props) => {

	const testWordsDivRef = useRef<HTMLDivElement>(null);
	const testWordObjectRef = useRef<HTMLDivElement[]>([]);
	const testWordIndividualLettersRef = useRef<Array<HTMLSpanElement|null>>([]);
	testWordIndividualLettersRef.current = [];

	const [currentCharacterCount, setCurrentCharacterCount] = useState<number>(0);

	const letterWidths = useRef<number[]>([]);
	const spaceBarRef = useRef<number>(0); // related to inputWordsArray.length
	spaceBarRef.current = inputWordsArray.length;

	const [inputWordsArrayLength, setInputWordsArrayLength] = useState<number>(0);

	const widths = useRef<number[]>([]);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);
	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});
	const [offsetLines, setOffsetLines] = useState<number>(0);
	const [wordScrollTransitionProperty, setWordScrollTransitionProperty] = useState<string>("top");

	const [caretPosition, setCaretPosition] = useState<number>(0);

	useEffect(() => {

		setCaretPosition(0);
		setCurrentCharacterCount(0);
		setOffsetLines(0);


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
		widths.current.slice(0, testWords.words.length);

		testWordObjectRef.current.forEach((word, index) => {
			if (word)
				widths.current[index] = word.getBoundingClientRect().width;
		});

		// store and calculate lengths of words up until the limit (div width)
		let lineWidthCurrentTotal = 0;
		const finalLineIndexes = widths.current.map((wordDiv, index) => {
			const wordWidth = wordDiv + MARGIN_RIGHT;
			
			if (lineWidthCurrentTotal + wordWidth <= divWidth) { // if new word can fit on the same line		
				lineWidthCurrentTotal += wordWidth; // add it to the current
			}
			else { // if new word can't fit on the same line
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

		setTestWords({...testWords, words: newTestWords});

	}, [potentialSpanShiftCount, windowSize.width]);


	useEffect(() => {
		let numOffsetLines = calculateTestWordsDivOffset(testWords.words);
		if (numOffsetLines == 1) numOffsetLines = 0;
		else if (numOffsetLines > 1) numOffsetLines -=1;
		setOffsetLines(numOffsetLines);


		// if a new character has been added, update character count for caret 
		if (currentCharacterCount !== testWords.characterCount - (testWords.words.length - 1)) {
			setCurrentCharacterCount(testWords.characterCount - (testWords.words.length - 1));
			testWordIndividualLettersRef.current = testWordIndividualLettersRef.current.slice(0, testWords.characterCount - (testWords.words.length - 1));
		}

		if (inputWordsArrayLength !== inputWordsArray.length) {
			setInputWordsArrayLength(inputWordsArray.length);
			return;
		}

		// store the widths of each letter in an array
		testWordIndividualLettersRef.current.forEach((letter, index) => {
			if (letter) 
				letterWidths.current[index] = letter.offsetWidth;			
		});

		// get the current letter the user is up to 
		const currentLetterIndex = inputWordsArray
			.reduce((totalLength, word) => 
				totalLength + word.length, 0) + currentInputWord.length - 1;

		// get the total width of letter spans typed so far 
		const currentDistanceCovered = letterWidths.current
			.slice(0, currentLetterIndex + 1)
			.reduce((totalWidth, letter) => totalWidth + letter, 0);

		// set caret position accordingly
		setCaretPosition(currentDistanceCovered + (16 * inputWordsArrayLength));
		console.log("current index is " + currentLetterIndex);
		console.log("current distance is " + currentDistanceCovered);		
	}, [testWords.words]);

	useEffect(() => {
		console.log("hello");
		setCaretPosition(caretPosition + 16);
	}, [inputWordsArrayLength]);

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
		"--caret-position": caretPosition + "px"
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