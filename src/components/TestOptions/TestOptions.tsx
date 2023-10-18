import React from "react";
import TestTypeSelector from "./TestTypeSelector";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";
import TestLengthSecondsSelector from "./TestLengthSecondsSelector";
import TestLengthWordsSelector from "./TestLengthWordsSelector";
import "../../styles/componentStyles/test-options.scss";



const TestOptions = () => {
	return (
		<div className="test-options">
			<TestTypeSelector />
			<NumberSelector />
			<PunctuationSelector />
			<TestLengthWordsSelector />
			<TestLengthSecondsSelector />
		</div>
	);
};

export default TestOptions;