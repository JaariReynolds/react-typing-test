/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { TestWords, Letter, LetterActiveStatus, CompletionStatus } from "../interfaces/WordStructure";

interface Props {
    testWords: TestWords,
    testRunning: boolean,
    testComplete: boolean,
    testFocused: boolean
}

interface NumberPair {
    width: number,
    height: number
}

const MAX_LINES = 3;
let PADDING_BOTTOM = 0;
let MARGIN_RIGHT = 0;


export const TypingTestWords = ({testWords, testRunning, testComplete, testFocused}: Props) => {

	const testWordsDivRef = useRef<HTMLDivElement>(null);
	const testWordObjectRef = useRef<HTMLDivElement[]>([]) ;
	const widths = useRef<number[]>([]);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);
	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});


	useEffect(() => {
		// grab css sizing properties on mount
		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);
		
		if (testWordObjectRef.current.length > 0) {
			const singleWordObject = testWordObjectRef.current[0];
			const otherComputedStyle = window.getComputedStyle(singleWordObject);
			MARGIN_RIGHT = parseInt(otherComputedStyle.getPropertyValue("margin-right"), 10);
		}

		PADDING_BOTTOM = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
		
		console.log("margin right is " + MARGIN_RIGHT);
		// add listener to window size
		const handleResize = () => {
			setWindowSize({width: window.innerWidth, height: window.innerHeight});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// only check to change test height when window height is changed
	useEffect(() => {
		
		const computedStyle = window.getComputedStyle(testWordsDivRef.current!); 
		const lineHeight = parseInt(computedStyle.getPropertyValue("line-height"), 10);

		const currentHeight = parseInt(computedStyle.getPropertyValue("height"), 10);
		console.log("currentHeight" + currentHeight);

		const currentTestWordsMaxHeight = (lineHeight * MAX_LINES) + PADDING_BOTTOM;

		setTestWordsMaxHeight(currentTestWordsMaxHeight);

		console.log("filler height: " + (currentTestWordsMaxHeight - currentHeight));
		
	}, [windowSize.height, testWords.characterCount]);

	useEffect(() => {
		if (testWordObjectRef.current === null) return;

		const computedStyle = window.getComputedStyle(testWordsDivRef.current!);
		const divWidth = parseInt(computedStyle.getPropertyValue("width"), 10);
		console.log("div width:" + divWidth);

		testWordObjectRef.current.forEach((word, index) => {
			if (word)
				widths.current[index] = word.getBoundingClientRect().width;
		});



		let lineWidthCurrentTotal = 0;
		const finalLineIndexes = widths.current.map((wordDiv, index) => {
			const wordWidth = wordDiv + MARGIN_RIGHT;
			if (lineWidthCurrentTotal + wordWidth <= divWidth) { // if new word can fit on the same line
				
				lineWidthCurrentTotal += wordWidth; // add it to the current
				console.log("new lineWidth is " + lineWidthCurrentTotal);
			}
			else { // if new word can't fit on the same line
				lineWidthCurrentTotal = wordWidth; // reset line starting with this word length
				return index - 1; /// add that inde to the list 
			}
		});

		const realFinalLinesIndexes = finalLineIndexes.slice(0, testWords.words.length);

		console.log(realFinalLinesIndexes);
	}, [testWords]);

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
		if (letter.active === LetterActiveStatus.Active || letter.active === LetterActiveStatus.ActiveLast) {
			if (!testRunning || (testRunning && !testFocused)) {
				return "awaiting-input";
			}
			return "";
		}		
		return "";			
	};

	const testWordsLineHeight = {
		"--test-words-max-height": testWordsMaxHeight + "px",
	} as React.CSSProperties;


	return (
		<>
			<div style={testWordsLineHeight} ref={testWordsDivRef} className="words-container">
				{testWords.words.map((word, index) => {
					return (
						<div className="word" ref={(ref) => (testWordObjectRef.current[index] = ref as HTMLDivElement)}>
							{word.word.map(letter => {
								return (
									<span className={`letter ${letterColour(letter.status)} ${blinkingCaret(letter)} ${letterActive(letter.active)}`}>
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