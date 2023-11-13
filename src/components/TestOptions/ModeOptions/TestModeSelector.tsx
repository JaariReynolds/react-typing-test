/* eslint-disable react/jsx-key */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { TestModeTabs } from "./ModeOptions";
import { useTestInformationContext } from "../../../contexts/TestInformationContext";
import { TestMode } from "../../../enums";


interface TestModeTabProps {
    activeTab: TestModeTabs,
    setActiveTab: React.Dispatch<React.SetStateAction<TestModeTabs>>
}

const TestModeSelector = ({activeTab, setActiveTab}: TestModeTabProps) => {
	const {setTestMode} = useTestInformationContext();

	const handleOptionChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setActiveTab(event.target.value as TestModeTabs);
		localStorage.setItem("testModeTab", event.target.value);
		if (event.target.value as TestModeTabs === TestModeTabs.Standard) {
			setTestMode(TestMode.Standard);
			localStorage.setItem("testMode", event.target.value);
		}
	};

	return (
		<div className="tab-selector test-option-selector">
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
					<FontAwesomeIcon icon={faKeyboard} className="test-options-icon"/>
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
						<FontAwesomeIcon icon={faGamepad} className="test-options-icon"/>
                   		{TestModeTabs.Funbox.toString()}
					</span>
				</label>
			</div>
			<div className="tab-selected-underline" style={{transform: activeTab === TestModeTabs.Standard ? "translateX(0%)" : "translateX(100%)"}}></div>
		</div>
	);
};

export default TestModeSelector;