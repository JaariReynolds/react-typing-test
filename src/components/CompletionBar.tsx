import React from "react";

interface Props {
    completionBarWidth: React.CSSProperties
}

const CompletionBar = ({completionBarWidth}: Props) => {
	return (
		<div style={completionBarWidth} className="test-completion-bar"></div>
	);
};

export default CompletionBar;