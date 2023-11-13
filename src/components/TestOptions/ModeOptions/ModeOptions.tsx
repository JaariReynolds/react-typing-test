import React from "react";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestMode } from "../../../enums";


enum TestModeTabs {
	Standard = "standard",
	Funbox = "funbox"
}

const ModeOptions = () => {
	const {testMode, setTestMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestMode(event.target.value as TestMode);
		localStorage.setItem("testMode", event.target.value);
	};

	return (
		<div className="extra-options-container">
			<div className="test-option-selector">
				<span className="option-text">
					<input
						type="radio"	
						id="standard"
						value={TestMode.Standard.toString()}							
						checked={testMode===TestMode.Standard}
						onChange={handleOptionChange}
						className="hidden-radio-button"
					/>
					<label htmlFor={TestMode.Standard.toString()} className="selectable-label">							
						{TestModeTabs.Standard.toString()}
					</label>
				</span>	
			</div>
			
			<div className="test-option-selector">
				<span className="option-text">
					<input
						type="radio"
						id="emojis"
						value={TestMode.Emojis.toString()}							
						checked={testMode===TestMode.Emojis}
						onChange={handleOptionChange}
						className="hidden-radio-button"
					/>
					<label htmlFor={TestMode.Emojis.toString()} className="selectable-label">							
						{TestMode.Emojis.toString()}
					</label>
				</span>		
			</div>
		</div>
		
	);
};

export default ModeOptions;