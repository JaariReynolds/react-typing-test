import "../styles/componentStyles/words-per-minute.scss";

import React from "react";

export interface WordsPerMinuteProps {
    opacityStyle: React.CSSProperties,
    currentWPM: number
}

const WordsPerMinute = ({opacityStyle, currentWPM}: WordsPerMinuteProps) => {
	return (
		<div style={opacityStyle} className="WPM-div">
			{currentWPM}
		</div>
	);
};

export default WordsPerMinute;