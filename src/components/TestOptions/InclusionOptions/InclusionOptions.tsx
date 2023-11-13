import React from "react";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";


const InclusionOptions = () => {
	return (
		<div className="extra-options-container">
			<NumberSelector />
			<PunctuationSelector />
		</div>
	);
};

export default InclusionOptions;