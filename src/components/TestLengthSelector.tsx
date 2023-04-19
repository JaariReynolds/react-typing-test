/* eslint-disable react/jsx-key */
import React from "react";

interface IProps {
    testLength: number,
    setTestLength: (prop: number) => void,
	opacityStyle: React.CSSProperties
}

const TestLengthSelector = ({testLength, setTestLength, opacityStyle}: IProps) => {
	const testLengthWords: number[] = [5, 25, 50, 100];

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestLength(parseInt(event.target.value));
	};

	const renderOptions = () => {
		return (
			<div style={opacityStyle} className="test-option-selector">
				{testLengthWords.map(length => {
					return (
						<span className="option-text">
							<input
								type="radio"
								id={length.toString()}
								value={length}							
								checked={testLength===length}
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

	return (
		<div>
			{renderOptions()}
		</div>
      
	);

};

export default TestLengthSelector;