import React from "react";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTestInformationContext } from "../../contexts/TestInformationContext";


const NumberSelector = () => {
	const {includeNumbers, setIncludeNumbers} = useTestInformationContext();

	const handleOptionChange = () => {
		setIncludeNumbers(!includeNumbers);
		localStorage.setItem("testIncludeNumbers", (!includeNumbers).toString());
	};

	return (
		<div className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="numbers"
					checked={includeNumbers}
					onChange={handleOptionChange} 
					className="hidden peer"
				/>
				<label htmlFor="numbers" className="selectable-label">
					<FontAwesomeIcon icon={faHashtag} className="test-options-icon" />
						numbers
				</label>
			</span>
		</div>
	);
};

export default NumberSelector;