/* eslint-disable react/jsx-key */
import React from "react";

interface IProps {
    testLengthSeconds: number,
    setTestLengthSeconds: (prop: number) => void,
	opacityStyle: React.CSSProperties
}

const TestLengthSecondsSelector = ({testLengthSeconds, setTestLengthSeconds, opacityStyle}: IProps) => {
	const testLengthWords: number[] = [15, 30, 45, 60];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLengthSeconds(parseInt(event.target.value));
	};

	return (
		<div style={opacityStyle} className="test-option-selector">
			{testLengthWords.map(length => {
				return (
					<span className="option-text">
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