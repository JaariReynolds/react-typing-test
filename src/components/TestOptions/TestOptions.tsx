import React, { memo } from "react";
import "./test-options.scss";
import StandardOptions from "./StandardOptions/StandardOptions";
import ModeOptions from "./ModeOptions/ModeOptions";



const TestOptions = () => {
	return (
		<div className="test-options">
			<StandardOptions />
			<ModeOptions />
		</div>
	);
};

export default memo(TestOptions);