import "../styles/componentStyles/completion-bar.scss";

import React from "react";

export interface CompletionBarProps {
    completionBarWidth: React.CSSProperties
}

const CompletionBar = ({completionBarWidth}: CompletionBarProps) => {
	return (
		<div style={completionBarWidth} className="completion-bar"></div>
	);
};

export default CompletionBar;