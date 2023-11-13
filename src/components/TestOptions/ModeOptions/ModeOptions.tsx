import React, {useState} from "react";
import TestModeSelector from "./TestModeSelector";
import InclusionOptions from "./InclusionOptions";
import FunboxModesSelector from "./FunboxModesSelector";

export enum TestModeTabs {
	Standard = "standard",
	Funbox = "funbox"
}

const ModeOptions = () => {
	const [activeTab, setActiveTab] = useState<TestModeTabs>(localStorage.getItem("testModeTab") as TestModeTabs ?? TestModeTabs.Standard);

	return (
		<div className="mode-options-container">
			<TestModeSelector activeTab={activeTab} setActiveTab={setActiveTab}/>
			<InclusionOptions activeTab={activeTab}/>
			<FunboxModesSelector activeTab={activeTab} />
		</div>
	);
};

export default ModeOptions;