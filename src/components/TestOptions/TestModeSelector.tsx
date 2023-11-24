import React from "react";
import "./test-mode-selector.scss";
import { TestModeTabs } from "./ModeOptions/ModeOptions";
import { useTestInformationContext } from "../../contexts/TestInformationContext";
import { TestMode } from "../../enums";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faKeyboard } from "@fortawesome/free-solid-svg-icons";

interface TestModeSelectorProps {
    activeTab: TestModeTabs,
    setActiveTab: React.Dispatch<React.SetStateAction<TestModeTabs>>
}

const TestModeSelector = ({activeTab, setActiveTab}: TestModeSelectorProps) => {
	const {setTestMode, funboxMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setActiveTab(event.target.value as TestModeTabs);
		localStorage.setItem("testModeTab", event.target.value);

		if (event.target.value as TestModeTabs === TestModeTabs.Standard) {
			setTestMode(TestMode.Standard);
			localStorage.setItem("testMode", event.target.value);
		} else {	
			setTestMode(funboxMode);
			localStorage.setItem("testMode", funboxMode);
		}
	};
		
	return (
		<div className="test-mode-selector test-option-selector">
			<div className="option-text">
 				<input
 					type="radio"
 					id="standard"
 					value={TestModeTabs.Standard}
 					name="testMode"
 					checked={activeTab === TestModeTabs.Standard}
 					onChange={handleOptionChange}
 					className="hidden-radio-button"
 				/>
 				<label htmlFor="standard" className="selectable-label">
 					<FontAwesomeIcon icon={faKeyboard} className="standard-icon-left"/>
 					{TestModeTabs.Standard.toString()}
 				</label>
 			</div>
			 <div className="option-text">
 				<input
 					type="radio"
 					id="funbox"
 					value={TestModeTabs.Funbox}
 					name="testMode"
 					checked={activeTab === TestModeTabs.Funbox}
 					onChange={handleOptionChange}
 					className="hidden-radio-button"
 				/>
 				<label htmlFor="funbox" className="selectable-label">
 					<span>
 						<FontAwesomeIcon icon={faGamepad} className="standard-icon-left"/>
                    		{TestModeTabs.Funbox.toString()}
 					</span>
 				</label>
 			</div>
			<div style={{left: activeTab === TestModeTabs.Standard ? "" : "50%"}} className="option-selected-bar"></div>
		</div>
	);
};

export default TestModeSelector;