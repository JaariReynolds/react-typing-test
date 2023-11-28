import React from "react";
import { TestMode } from "../../../enums";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestModeTabs } from "./ModeOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownAZ, faEarthAmericas, faFire, faFlask, faPrescriptionBottleMedical } from "@fortawesome/free-solid-svg-icons";
import { faSmileBeam } from "@fortawesome/free-regular-svg-icons";

const FunboxModesSelector = ({activeTab}: {activeTab: TestModeTabs}) => {
	const {testMode, setTestMode, setFunboxMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		const newTestMode: TestMode = event.target.value as TestMode;
		setTestMode(newTestMode);
		setFunboxMode(newTestMode);
		localStorage.setItem("testMode", event.target.value);
		localStorage.setItem("funboxMode", newTestMode);
	};

	const interactableStyle = (activeTab === TestModeTabs.Funbox) ? "" : "uninteractable-selector"; 
	return (
		<div style={{opacity: activeTab === TestModeTabs.Funbox ? 1 : 0}} className={` test-option-selector test-mode-funbox ${interactableStyle}`}>
			<div className="funbox-scrolling-container">
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
						{TestMode.Alphabet.toString()}
					</label>
				</span>				
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
						{TestMode.Medicine.toString()}
					</label>
				</span>		
				<span className="option-text">
					<input
						type="radio"
						id="chemicalElements"
						value={TestMode.ChemicalElements}							
						checked={testMode===TestMode.ChemicalElements}
						onChange={handleOptionChange}
						className="hidden-radio-button"
					/>
					<label htmlFor="chemicalElements" className="selectable-label">			
						<FontAwesomeIcon icon={faFlask} className="standard-icon-left"/>				
						{TestMode.ChemicalElements.toString()}
					</label>
				</span>				
				<span className="option-text">
					<input
						type="radio"
						id="genZSlang"
						value={TestMode.GenZSlang}							
						checked={testMode===TestMode.GenZSlang}
						onChange={handleOptionChange}
						className="hidden-radio-button"
					/>
					<label htmlFor="genZSlang" className="selectable-label">			
						<FontAwesomeIcon icon={faFire} className="standard-icon-left"/>				
						{TestMode.GenZSlang.toString()}
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
						{TestMode.Countries.toString()}
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
						{TestMode.Emojis.toString()}
					</label>
				</span>	
			</div>				
		</div>
	);
};

export default FunboxModesSelector;