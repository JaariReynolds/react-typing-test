import React, { useState } from "react";
import "./test-options.scss";
import StandardOptions from "./StandardOptions/StandardOptions";
import ModeOptions, { TestModeTabs } from "./ModeOptions/ModeOptions";
import TestModeSelector from "./TestModeSelector";



const TestOptions = () => {
	const [activeTab, setActiveTab] = useState<TestModeTabs>(localStorage.getItem("testModeTab") as TestModeTabs ?? TestModeTabs.Standard);

	
	return (
		<div className="test-options-container">
		
			<TestModeSelector activeTab={activeTab} setActiveTab={setActiveTab}/>
			<div className="test-options">
				<StandardOptions />
				<ModeOptions activeTab={activeTab}/>
			</div>
		</div>
		
	);
};

export default TestOptions;