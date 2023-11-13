import React from "react";
import { TestMode } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestModeTabs } from "./ModeOptions";



const FunboxModesSelector = ({activeTab}: {activeTab: TestModeTabs}) => {
	const {testMode, setTestMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setTestMode(event.target.value as TestMode);
		localStorage.setItem("testMode", event.target.value);
	};

	const interactableStyle = (activeTab === TestModeTabs.Funbox) ? "" : "uninteractable-selector"; // css class


	return (
		<div style={{opacity: activeTab === TestModeTabs.Funbox ? 1 : 0}} className={` test-option-selector test-mode-funbox ${interactableStyle}`}>
			<span className="option-text">
				<input
					type="radio"
					id="emojis"
					value={TestMode.Emojis}							
					checked={testMode===TestMode.Emojis}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="emojis" className="selectable-label">							
					emojis
				</label>
			</span>		
		</div>
	);
};

export default FunboxModesSelector;