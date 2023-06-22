/* eslint-disable react/jsx-key */
import React from "react";
import { TestType } from "../App";

interface IProps {
    testLengthSeconds: number,
    setTestLengthSeconds: (prop: number) => void,
	opacityStyle: React.CSSProperties,
	testType: TestType
}

const TestLengthSecondsSelector = ({testLengthSeconds, setTestLengthSeconds, opacityStyle, testType}: IProps) => {
	const testLengthWords: number[] = [5, 15, 30, 45, 60, 120];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLengthSeconds(parseInt(event.target.value));
	};

	const interactableStyle = (testType === TestType.Time) ? "" : "uninteractable-selector"; // css class

	return (
		<div style={opacityStyle} className={`test-option-selector test-type-time ${interactableStyle}`}>
			{testLengthWords.map((length, index) => {
				return (
					<span key={index} className="option-text">
						<input
							type="radio"
							id={length.toString()}
							value={length}							
							checked={testLengthSeconds===length}
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

export default TestLengthSecondsSelector;