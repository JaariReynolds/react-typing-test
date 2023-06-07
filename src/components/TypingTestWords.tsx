/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { TestWords, Letter, LetterActiveStatus, CompletionStatus } from "../interfaces/WordStructure";
import { testWordsGenerator } from "../functions/wordGeneration/testWordsGenerators";

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
let LINE_HEIGHT = 0;
let FONT_SIZE = 0;
let LETTER_SPACING = 0;


export const TypingTestWords = ({testWords, testRunning, testComplete, testFocused}: Props) => {

	const testWordsRef = useRef<HTMLDivElement>(null);
	const [testWordsMaxHeight, setTestWordsMaxHeight] = useState<number>(0);
	const [windowSize, setWindowSize] = useState<NumberPair>({width: window.innerWidth, height: window.innerHeight});


	useEffect(() => {
		// grab css sizing properties on mount
		const computedStyle = window.getComputedStyle(testWordsRef.current!);
		PADDING_BOTTOM = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
		LINE_HEIGHT = parseInt(computedStyle.getPropertyValue("line-height"), 10);
		FONT_SIZE = parseInt(computedStyle.getPropertyValue("font-size"), 10);
		LETTER_SPACING = parseInt(computedStyle.getPropertyValue("letter-spacing"), 10);

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
		
		const computedStyle = window.getComputedStyle(testWordsRef.current!); 
		const lineHeight = parseInt(computedStyle.getPropertyValue("line-height"), 10);

		const currentHeight = parseInt(computedStyle.getPropertyValue("height"), 10);
		console.log("currentHeight" + currentHeight);

		const currentTestWordsMaxHeight = (lineHeight * MAX_LINES) + PADDING_BOTTOM;

		setTestWordsMaxHeight(currentTestWordsMaxHeight);

		console.log("filler height: " + (currentTestWordsMaxHeight - currentHeight));
		
	}, [windowSize.height, testWords.characterCount]);

	useEffect(() => {
		const computedStyle = window.getComputedStyle(testWordsRef.current!);
		const width = parseInt(computedStyle.getPropertyValue("width"), 10);
		const divs = 
		console.log(width);
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
			<div style={testWordsLineHeight} ref={testWordsRef} className="words-container">
				{testWords.words.map(word => {
					return (
						<div className="word">
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