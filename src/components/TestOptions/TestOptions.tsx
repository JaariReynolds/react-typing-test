import React, { memo } from "react";

import "./test-options.scss";
import TestTypeAndLengthSelector from "./TestTypeAndLengthSelector";
import ExtraOptions from "./ExtraOptions";



const TestOptions = () => {
	return (
		<div className="test-options">
			<TestTypeAndLengthSelector />
			<ExtraOptions />
		</div>
	);
};

export default memo(TestOptions);