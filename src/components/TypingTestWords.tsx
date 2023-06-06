/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import { TestWords, Letter, LetterActiveStatus, CompletionStatus } from "../interfaces/WordStructure";

interface Props {
    testWords: TestWords,
    testRunning: boolean,
    testComplete: boolean,
    testFocused: boolean
}

const MAX_LINES = 3;
let PADDING_BOTTOM = 0;

export const TypingTestWords = ({testWords, testRunning, testComplete, testFocused}: Props) => {

	// padding bottom is never changed, only grab the value once on mount
	useEffect(() => {
		const computedStyle = window.getComputedStyle(testWordsRef.current!);
		PADDING_BOTTOM = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
	}, []);

	const testWordsRef = useRef<HTMLDivElement>(null);
	const [testWordsHeight, setTestWordsHeight] = useState<number>(0);

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
		"--test-words-max-height": testWordsHeight + "px"
	} as React.CSSProperties;

	useEffect(() => {
		const computedStyle = window.getComputedStyle(testWordsRef.current!); 
		const lineHeight = parseInt(computedStyle.getPropertyValue("line-height"), 10);
		const paddingBottom = parseInt(computedStyle.getPropertyValue("padding-bottom"), 10);
		console.log("padding bottom is:" + paddingBottom);
		setTestWordsHeight((lineHeight * MAX_LINES) + PADDING_BOTTOM);
	}, [testWords]);

	return (
		<div style={testWordsLineHeight} ref={testWordsRef} className="words-container">
			{testWords.words.map(word => {
				return (
					<div className="word">
						{word.word.map(letter => {
							return (
								<span className={`letter ${letterColour(letter.status)} ${blinkingCaret(letter)} ${letterActive(letter.active)} 
										`}>
									{letter.letter}
								</span>
							);}
						)}
					</div> 
				);
			})}
		</div>
	);
};