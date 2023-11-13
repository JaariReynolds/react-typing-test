import React from "react";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestMode } from "../../../enums";


const PunctuationSelector = () => {
	const {includePunctuation, setIncludePunctuation, testMode} = useTestInformationContext();

	const handleOptionChange = () => {
		setIncludePunctuation(!includePunctuation);
		localStorage.setItem("testIncludePunctuation", (!includePunctuation).toString());
	};

	return (
		<div className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="punctuation"
					checked={includePunctuation}
					onChange={handleOptionChange}
					className="hidden peer"
					disabled={testMode !== TestMode.Standard}
				/>
				<label htmlFor="punctuation" className="selectable-label">
					<FontAwesomeIcon icon={faAt} className="test-options-icon"/>
					punctuation
				</label>
				
			</span>
		</div>
	);
};

export default PunctuationSelector;