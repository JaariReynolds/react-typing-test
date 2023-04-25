/* eslint-disable react/jsx-key */
import React from "react";
import { TestType } from "../App";

interface IProps {
    testType: TestType,
    setTestType: React.Dispatch<React.SetStateAction<TestType>>,
	opacityStyle: React.CSSProperties
}

const TestTypeSelector = ({testType, setTestType, opacityStyle}: IProps) => {
	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestType(event.target.value as TestType);
	};

	return (
		<div style={opacityStyle} className="test-option-selector">
			<span className="option-text">
				<input
					type="radio"
					id="words"
					value={TestType.Words}
					name="testType"
					checked={testType === TestType.Words}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="words" className="selectable-label">
                    Words
				</label>
			</span>

			<span className="option-text">
				<input
					type="radio"
					id="time"
					value={TestType.Time}
					name="testType"
					checked={testType === TestType.Time}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="time" className="selectable-label">
                    Time
				</label>
			</span>
		</div>
	);
};

export default TestTypeSelector;