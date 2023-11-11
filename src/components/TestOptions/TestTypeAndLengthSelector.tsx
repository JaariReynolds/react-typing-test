import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";

const TestTypeAndLengthSelector = () => {
	return (
		<div className="test-type-and-length-container">
			<TestTypeSelector />
			<TestLengthWordsSelector />
			<TestLengthSecondsSelector />
		</div>
	);
};

export default TestTypeAndLengthSelector;