/* eslint-disable react/jsx-key */
import React from "react";
import { TestMode, TestType } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";

const TestLengthWordsSelector = () => {
	const numWords: number[] = [10, 25, 50, 75, 100];
	const {testLengthWords, setTestLengthWords, testType, testMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLengthWords(parseInt(event.target.value));
		localStorage.setItem("testLengthWords", event.target.value);
	};

	const interactableStyle = (testType === TestType.Words) ? "" : "uninteractable-selector"; // css class

	return (
		<div style={{opacity: testType === TestType.Words ? 1 : 0}} className={`test-option-selector test-type-words ${interactableStyle}`}>
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
							disabled={testMode === TestMode.Alphabet}
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