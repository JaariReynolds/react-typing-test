import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";

const StandardOptions = () => {
	return (
		<div className="standard-options-container">
			<TestTypeSelector />
			<TestLengthWordsSelector />
			<TestLengthSecondsSelector />
		</div>
	);
};

export default StandardOptions;