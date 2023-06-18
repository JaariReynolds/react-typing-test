import React from "react";

interface Props {
    completionBarOpacity: React.CSSProperties
}

const CompletionBar = ({completionBarOpacity}: Props) => {
	return (
		<div style={completionBarOpacity} className="test-completion-bar"></div>
	);
};

export default CompletionBar;