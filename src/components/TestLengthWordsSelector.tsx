/* eslint-disable react/jsx-key */
import React from "react";

interface IProps {
    testLengthWords: number,
    setTestLengthWords: (prop: number) => void,
	opacityStyle: React.CSSProperties
}

const TestLengthWordsSelector = ({testLengthWords, setTestLengthWords, opacityStyle}: IProps) => {
	const numWords: number[] = [5, 25, 50, 100];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLengthWords(parseInt(event.target.value));
	};

	return (
		<div style={opacityStyle} className="test-option-selector">
			{numWords.map(length => {
				return (
					<span className="option-text">
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