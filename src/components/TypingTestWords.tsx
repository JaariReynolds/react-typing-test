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
	potentialSpanShiftCount: number
}

interface NumberPair {
    width: number,
    height: number
}

const MAX_LINES = 3;
let PADDING_BOTTOM = 0;
const MARGIN_RIGHT = 16;


export const TypingTestWords = ({testWords, setTestWords, testRunning, testComplete, testFocused, potentialSpanShiftCount}: Props) => {

	const testWordsDivRef = useRef<HTMLDivElement>(null);
	const testWordObjectRef = useRef<HTMLDivElement[]>([]) ;
	const widths = useRef<number[]>([]);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);
	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});
	const [offsetLines, setOffsetLines] = useState<number>(0);
	const [wordScrollTransitionProperty, setWordScrollTransitionProperty] = useState<string>("top");
	const [wordsArrayCopy, setWordsArrayCopy] = useState<Word[]>([]);

	useEffect(() => {
		// grab css sizing properties on mount
		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);

		PADDING_BOTTOM = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
		setOffsetLines(0);
		setWordsArrayCopy([]);
		
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

	// calculate the new end-of-line words when screenwidth changes OR 
	useEffect(() => {
		if (testWordObjectRef.current === null) return;

		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);
		const divWidth = parseInt(computedStyle.getPropertyValue("width"), 10);
		widths.current.slice(0, testWords.words.length);

		testWordObjectRef.current.forEach((word, index) => {
			if (word)
				widths.current[index] = word.getBoundingClientRect().width;
		});

		let lineWidthCurrentTotal = 0;
		const finalLineIndexes = widths.current.map((wordDiv, index) => {
			const wordWidth = wordDiv + MARGIN_RIGHT;
			
			if (lineWidthCurrentTotal + wordWidth <= divWidth) { // if new word can fit on the same line		
				lineWidthCurrentTotal += wordWidth; // add it to the current
			}
			else { // if new word can't fit on the same line
				lineWidthCurrentTotal = wordWidth; // reset line starting with this word length
				return index - 1; /// add that inde to the list 
			}
		}).slice(0, testWords.words.length);	

		const newTestWords = testWords.words.map((word, wordIndex) => {
			if (finalLineIndexes.includes(wordIndex)) {
				return {...word, isLastWordInLine: true};
			}
			else 
				return {...word, isLastWordInLine: false};
		});

		setWordsArrayCopy(newTestWords);

	}, [potentialSpanShiftCount, windowSize.width, testWords]);


	useEffect(() => {
		let numOffsetLines = calculateTestWordsDivOffset(wordsArrayCopy);
		if (numOffsetLines == 1) numOffsetLines = 0;
		else if (numOffsetLines > 1) numOffsetLines -=1;
		setOffsetLines(numOffsetLines);
	}, [wordsArrayCopy]);
	
	useEffect(() => {
		setTestWords({...testWords, words: wordsArrayCopy});
	}, [testComplete]);

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

	const blinkingCaret = (letter: Letter) => {
		if (letter.active != LetterActiveStatus.Inactive) {
			if (!testRunning || (testRunning && !testFocused)) {
				return "awaiting-input";
			}
			return "";
		}		
		return "";			
	};

	const testWordsStyling = {
		"--word-scroll-transition-property": wordScrollTransitionProperty,
		"--test-words-max-height": testWordsMaxHeight + "px",
		"--test-words-div-offset": -(offsetLines * testWordsMaxHeight / MAX_LINES) + "px"
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
				{wordsArrayCopy.map((word, index) => {
					return (
						<div key={index} className="word" ref={(ref) => (testWordObjectRef.current[index] = ref as HTMLDivElement)}>
							{word.word.map((letter, index) => {
								return (
									<span key={index} className={`letter ${letterColour(letter.status)} ${blinkingCaret(letter)} ${letterActive(letter.active)}`}>
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