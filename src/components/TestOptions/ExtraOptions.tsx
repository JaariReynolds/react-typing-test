import React from "react";
import NumberSelector from "./NumberSelector";
import PunctuationSelector from "./PunctuationSelector";

const ExtraOptions = () => {
	return (
		<div className="extra-options-container">
			<NumberSelector />
			<PunctuationSelector />
		</div>
	);
};

export default ExtraOptions;