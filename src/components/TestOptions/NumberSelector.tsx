import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IProps {
    numbers: boolean,
    setNumbers: (prop: boolean) => void,
}



const NumberSelector = ({numbers, setNumbers}: IProps) => {

	const handleOptionChange = () => {
		setNumbers(!numbers);
		localStorage.setItem("testIncludeNumbers", (!numbers).toString());
	};

	return (
		<div className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="numbers"
					checked={numbers}
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