/* eslint-disable react/jsx-key */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { TestType } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";

const TestTypeSelector = () => {
	const {testType, setTestType} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestType(event.target.value as TestType);
		localStorage.setItem("testType", event.target.value);
	};

	return (
		<div className="tab-selector test-option-selector">
			<div className="option-text">
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
					<FontAwesomeIcon icon={faFont} className="test-options-icon"/>
					{TestType.Words.toString()}
				</label>
			</div>
			<div className="option-text">
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
					<span>
						<FontAwesomeIcon icon={faClock} className="test-options-icon"/>
                   		{TestType.Time.toString()}
					</span>
				</label>
			</div>
			<div className="tab-selected-underline" style={{transform: testType === TestType.Words ? "translateX(0%)" : "translateX(100%)"}}></div>
		</div>
	);
};

export default TestTypeSelector;