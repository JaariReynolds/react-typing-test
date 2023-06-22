/* eslint-disable react/jsx-key */
import React from "react";
import { TestType } from "../App";

interface IProps {
    testLengthWords: number,
    setTestLengthWords: (prop: number) => void,
	opacityStyle: React.CSSProperties,
	testType: TestType
}

const TestLengthWordsSelector = ({testLengthWords, setTestLengthWords, opacityStyle, testType}: IProps) => {
	const numWords: number[] = [10, 25, 50, 75, 100];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLengthWords(parseInt(event.target.value));
	};

	const interactableStyle = (testType === TestType.Words) ? "" : "uninteractable-selector"; // css class

	return (
		<div style={opacityStyle} className={`test-option-selector test-type-words ${interactableStyle}`}>
			{numWords.map((length, index) => {
				return (
					<span key={index} className="option-text">
						<input
							type="radio"
							id={length.toString()}
							value={length}							
							checked={testLengthWords===length}
							onChange={handleOptionChange}
							className="hidden-radio-button"
						/>
						<label htmlFor={length.toString()} className="selectable-label">							
							{length}
						</label>
					</span>											
				);
			})}
		</div>
	);
};

export default TestLengthWordsSelector;