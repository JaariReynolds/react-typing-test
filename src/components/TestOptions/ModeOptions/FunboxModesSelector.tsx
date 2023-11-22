import React from "react";
import { TestMode, TestType } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestModeTabs } from "./ModeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faEarthAmericas, faPrescriptionBottleMedical } from "@fortawesome/free-solid-svg-icons";
import { faSmileBeam } from "@fortawesome/free-regular-svg-icons";



const FunboxModesSelector = ({activeTab}: {activeTab: TestModeTabs}) => {
	const {testMode, setTestMode, setTestType} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		const newTestMode: TestMode = event.target.value as TestMode;
		setTestMode(newTestMode);
		localStorage.setItem("testMode", event.target.value);

		if (newTestMode === TestMode.Alphabet) {
			setTestType(TestType.Words);
			localStorage.setItem("testType", TestType.Words.toString());
		}
	};

	const interactableStyle = (activeTab === TestModeTabs.Funbox) ? "" : "uninteractable-selector"; // css class

	return (
		<div style={{opacity: activeTab === TestModeTabs.Funbox ? 1 : 0}} className={` test-option-selector test-mode-funbox ${interactableStyle}`}>
			<span className="option-text">
				<input
					type="radio"
					id="medicine"
					value={TestMode.Medicine}							
					checked={testMode===TestMode.Medicine}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="medicine" className="selectable-label">			
					<FontAwesomeIcon icon={faPrescriptionBottleMedical} className="standard-icon-left"/>				
					medicine
				</label>
			</span>				
			
			<span className="option-text">
				<input
					type="radio"
					id="alphabet"
					value={TestMode.Alphabet}							
					checked={testMode===TestMode.Alphabet}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="alphabet" className="selectable-label">			
					<FontAwesomeIcon icon={faArrowDownAZ} className="standard-icon-left"/>				
					alphabet
				</label>
			</span>

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
					<FontAwesomeIcon icon={faSmileBeam} className="standard-icon-left"/>				
					emojis
				</label>
			</span>	

			<span className="option-text">
				<input
					type="radio"
					id="countries"
					value={TestMode.Countries}							
					checked={testMode===TestMode.Countries}
					onChange={handleOptionChange}
					className="hidden-radio-button"
				/>
				<label htmlFor="countries" className="selectable-label">			
					<FontAwesomeIcon icon={faEarthAmericas} className="standard-icon-left"/>				
					countries
				</label>
			</span>				
		</div>
	);
};

export default FunboxModesSelector;