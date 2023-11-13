import React from "react";
import { faAt, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestMode } from "../../../enums";


const InclusionOptions = () => {
	const {includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation} = useTestInformationContext();

	const handleNumbersOptionChange = () => {
		setIncludeNumbers(!includeNumbers);
		localStorage.setItem("testIncludeNumbers", (!includeNumbers).toString());
	};

	const handlePunctuationOptionChange = () => {
		setIncludePunctuation(!includePunctuation);
		localStorage.setItem("testIncludePunctuation", (!includePunctuation).toString());
	};

	return (
		<div className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="numbers"
					checked={includeNumbers}
					onChange={handleNumbersOptionChange} 
					className="hidden"
				/>
				<label htmlFor="numbers" className="selectable-label">
					<FontAwesomeIcon icon={faHashtag} className="test-options-icon" />
						numbers
				</label>
			</span>

			<span className="option-text">
				<input
					type="checkbox"
					id="punctuation"
					checked={includePunctuation}
					onChange={handlePunctuationOptionChange}
					className="hidden peer"
				/>
				<label htmlFor="punctuation" className="selectable-label">
					<FontAwesomeIcon icon={faAt} className="test-options-icon"/>
					punctuation
				</label>
				
			</span>
		</div>
	);
};

export default InclusionOptions;