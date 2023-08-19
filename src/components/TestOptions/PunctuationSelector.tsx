import { faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IProps {
    punctuation: boolean,
    setPunctuation: (prop: boolean) => void,
}

const PunctuationSelector = ({punctuation, setPunctuation}: IProps) => {
	return (
		<div className="test-option-selector">
			<span className="option-text">
				<input
					type="checkbox"
					id="punctuation"
					checked={punctuation}
					onChange={() => setPunctuation(!punctuation)}
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

export default PunctuationSelector;