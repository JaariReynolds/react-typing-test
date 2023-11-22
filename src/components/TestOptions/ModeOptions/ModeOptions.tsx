import React from "react";
import InclusionOptions from "./InclusionOptions";
import FunboxModesSelector from "./FunboxModesSelector";

export enum TestModeTabs {
	Standard = "standard",
	Funbox = "funbox"
}

const ModeOptions = ({activeTab}: {activeTab: TestModeTabs}) => {
	return (
		<div className="mode-options-container">
			<InclusionOptions activeTab={activeTab}/>
			<FunboxModesSelector activeTab={activeTab} />
		</div>
	);
};

export default ModeOptions;