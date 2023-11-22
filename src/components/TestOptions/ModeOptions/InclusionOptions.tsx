import React from "react";
import { faHashtag, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestModeTabs } from "./ModeOptions";


const InclusionOptions = ({activeTab}: {activeTab: TestModeTabs}) => {
	const {includeNumbers, setIncludeNumbers, includePunctuation, setIncludePunctuation} = useTestInformationContext();

	const handleNumbersOptionChange = () => {
		setIncludeNumbers(!includeNumbers);
		localStorage.setItem("testIncludeNumbers", (!includeNumbers).toString());
	};

	const handlePunctuationOptionChange = () => {
		setIncludePunctuation(!includePunctuation);
		localStorage.setItem("testIncludePunctuation", (!includePunctuation).toString());
	};

	const interactableStyle = (activeTab === TestModeTabs.Standard) ? "" : "uninteractable-selector"; // css class


	return (
		<div style={{opacity: activeTab === TestModeTabs.Standard ? 1 : 0}} className={`test-option-selector test-mode-standard ${interactableStyle}`}>
			<span className="option-text">
				<input
					type="checkbox"
					id="numbers"
					checked={includeNumbers}
					onChange={handleNumbersOptionChange} 
					className="hidden"
				/>
				<label htmlFor="numbers" className="selectable-label">
					<FontAwesomeIcon icon={faHashtag} className="standard-icon-left" />
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
					<FontAwesomeIcon icon={faQuoteLeft} className="standard-icon-left"/>
					punctuation
				</label>
				
			</span>
		</div>
	);
};

export default InclusionOptions;