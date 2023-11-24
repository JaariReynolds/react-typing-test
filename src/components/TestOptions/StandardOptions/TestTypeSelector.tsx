/* eslint-disable react/jsx-key */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { TestMode, TestType } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";

const TestTypeSelector = () => {
	const {testType, setTestType, testMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestType(event.target.value as TestType);
		localStorage.setItem("testType", event.target.value);
	};

	return (
		<div style={{borderColor: testMode === TestMode.Alphabet ? "rgba(0, 0, 0, 0.2" : ""}} className="tab-selector test-option-selector">
			<div className="option-text">
				<input
					type="radio"
					id="words"
					value={TestType.Words}
					name="testType"
					checked={testType === TestType.Words}
					onChange={handleOptionChange}
					className="hidden-radio-button"
					disabled={testMode === TestMode.Alphabet}
				/>
				<label htmlFor="words" className="selectable-label">
					<FontAwesomeIcon icon={faFont} className="standard-icon-left words-icon"/>
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
					disabled={testMode === TestMode.Alphabet}
				/>
				<label htmlFor="time" className="selectable-label">
					<span>
						<FontAwesomeIcon icon={faClock} className="standard-icon-left"/>
						{TestType.Time.toString()}
					</span>
				</label>
			</div>
			<div 
				className="tab-selected-underline" 
				style={{
					transform: testType === TestType.Words ? "translateX(0%)" : "translateX(100%)", 
					borderColor: testMode === TestMode.Alphabet ? "rgba(0, 0, 0, 0.2" : ""}}>
			</div>
		</div>
	);
};

export default TestTypeSelector;